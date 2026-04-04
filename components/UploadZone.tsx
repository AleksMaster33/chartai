'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, X, Cpu } from 'lucide-react'
import Image from 'next/image'

interface Props {
  onFileSelect: (file: File, preview: string) => void
  selectedFile: File | null
  preview: string | null
  onClear: () => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, selectedFile, preview, onClear, disabled }: Props) {
  const [drag, setDrag] = useState(false)

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]
    if (f) onFileSelect(f, URL.createObjectURL(f))
    setDrag(false)
  }, [onFileSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png','.jpg','.jpeg','.webp'] },
    maxFiles: 1, maxSize: 10*1024*1024, disabled,
    onDragEnter: () => setDrag(true),
    onDragLeave: () => setDrag(false),
    onDropRejected: () => setDrag(false),
  })

  if (preview && selectedFile) {
    return (
      <div className="relative rounded-2xl overflow-hidden group" style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
        <Image src={preview} alt="Chart" width={800} height={400}
          className="w-full object-contain max-h-72 bg-black" style={{ objectFit:'contain' }} />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button onClick={e => { e.stopPropagation(); onClear() }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-semibold transition-all"
            style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-display text-white/50"
          style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }}>
          <ImageIcon className="w-3 h-3" />
          <span className="truncate max-w-[180px]">{selectedFile.name}</span>
        </div>
      </div>
    )
  }

  return (
    <div {...getRootProps()} className={`upload-zone rounded-2xl p-10 text-center select-none ${drag ? 'dragging' : ''} ${disabled ? 'opacity-35 cursor-not-allowed' : ''}`}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-250 ${
          drag ? 'scale-110' : ''
        }`} style={{
          background: drag ? 'rgba(132,204,22,0.15)' : 'rgba(255,255,255,0.03)',
          border: drag ? '1px solid rgba(132,204,22,0.35)' : '1px solid rgba(255,255,255,0.07)',
        }}>
          <Upload className={`w-6 h-6 transition-colors duration-250 ${drag ? 'text-[#84cc16]' : 'text-white/20'}`} />
        </div>

        <div>
          <p className="font-display font-semibold text-white/65 mb-1.5 text-[15px]">
            {drag ? 'Drop chart here' : 'Upload chart screenshot'}
          </p>
          <p className="text-xs text-white/25">Drag & drop or click to browse · PNG, JPG, WebP · max 10MB</p>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {['TradingView', 'Binance', 'Bybit', 'OKX', 'Any platform'].map(p => (
            <span key={p} className="text-[10px] font-display rounded-full px-2.5 py-1 text-white/25"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
              {p}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-white/15 font-display">
          <Cpu className="w-3 h-3 text-[#84cc16]/40" />
          Gemini 2.0 Flash + Claude Sonnet
        </div>
      </div>
    </div>
  )
}
