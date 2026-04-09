'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, X, Cpu, CloudUpload } from 'lucide-react'
import Image from 'next/image'

interface Props {
  onFileSelect: (file: File, preview: string) => void
  selectedFile: File | null
  preview: string | null
  onClear: () => void
  disabled?: boolean
}

const LIME = '#84cc16'

export function UploadZone({ onFileSelect, selectedFile, preview, onClear, disabled }: Props) {
  const [drag, setDrag] = useState(false)

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]
    if (f) onFileSelect(f, URL.createObjectURL(f))
    setDrag(false)
  }, [onFileSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled,
    onDragEnter: () => setDrag(true),
    onDragLeave: () => setDrag(false),
    onDropRejected: () => setDrag(false),
  })

  if (preview && selectedFile) {
    return (
      <motion.div
        initial={{ opacity:0, scale:0.97 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
        className="relative rounded-2xl overflow-hidden group"
        style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
        <Image src={preview} alt="Chart" width={800} height={400}
          className="w-full object-contain max-h-72 bg-black"
          style={{ objectFit:'contain' }} />

        {/* hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <motion.button
            onClick={e => { e.stopPropagation(); onClear() }}
            whileHover={{ scale:1.05 }}
            whileTap={{ scale:0.95 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-semibold transition-all"
            style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171' }}>
            <X className="w-3.5 h-3.5" /> Remove chart
          </motion.button>
        </div>

        {/* file name tag */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-display text-white/50"
          style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.06)' }}>
          <ImageIcon className="w-3 h-3" />
          <span className="truncate max-w-[180px]">{selectedFile.name}</span>
        </div>

        {/* top lime border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background:`linear-gradient(90deg,transparent,${LIME}44,transparent)` }} />
      </motion.div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-2xl p-10 text-center select-none transition-all duration-300 cursor-pointer ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      style={{
        border: drag
          ? `1.5px dashed rgba(132,204,22,0.55)`
          : `1.5px dashed rgba(255,255,255,0.08)`,
        background: drag
          ? 'rgba(132,204,22,0.04)'
          : 'rgba(255,255,255,0.015)',
        boxShadow: drag
          ? `inset 0 0 40px rgba(132,204,22,0.04), 0 0 0 1px rgba(132,204,22,0.08)`
          : 'none',
      }}>
      <input {...getInputProps()} />

      {/* center content */}
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={drag ? { scale:1.12, rotate:5 } : { scale:1, rotate:0 }}
          transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{
            background: drag ? 'rgba(132,204,22,0.12)' : 'rgba(255,255,255,0.04)',
            border: drag ? '1px solid rgba(132,204,22,0.35)' : '1px solid rgba(255,255,255,0.07)',
          }}>
          {drag
            ? <CloudUpload className="w-6 h-6" style={{ color:LIME }} />
            : <Upload      className="w-6 h-6 text-white/20" />}
        </motion.div>

        <div>
          <p className="font-display font-semibold text-white/60 mb-1.5 text-[15px]">
            {drag ? 'Drop your chart here' : 'Upload chart screenshot'}
          </p>
          <p className="text-xs text-white/25">
            Drag & drop or click to browse · PNG, JPG, WebP · max 10MB
          </p>
        </div>

        {/* platform tags */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {['TradingView', 'Binance', 'Bybit', 'OKX', 'Any platform'].map(p => (
            <span key={p}
              className="text-[10px] font-display rounded-full px-2.5 py-1 text-white/22 transition-all duration-200"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
              {p}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-white/15 font-display">
          <Cpu className="w-3 h-3" style={{ color:`${LIME}44` }} />
          Gemini 2.0 Flash Vision + Claude Sonnet
        </div>
      </div>
    </div>
  )
}
