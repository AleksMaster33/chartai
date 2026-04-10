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

const G = '#00FF88'

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
        style={{ position:'relative', borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}
        className="group"
      >
        <Image src={preview} alt="Chart" width={800} height={400}
          style={{ width:'100%', objectFit:'contain', maxHeight:280, background:'#000', display:'block' }} />

        {/* hover overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'rgba(0,0,0,0.65)', opacity:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'opacity 0.2s',
        }}
          className="group-hover:opacity-100"
        >
          <button onClick={e => { e.stopPropagation(); onClear() }} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'8px 16px', borderRadius:10, fontSize:12, fontWeight:600, cursor:'pointer',
            background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.30)', color:'#f87171',
          }}>
            <X style={{ width:13, height:13 }} />
            Remove chart
          </button>
        </div>

        {/* filename tag */}
        <div style={{
          position:'absolute', bottom:10, left:10,
          display:'flex', alignItems:'center', gap:6,
          padding:'5px 10px', borderRadius:8, fontSize:11,
          background:'rgba(0,0,0,0.72)', backdropFilter:'blur(8px)',
          border:'1px solid rgba(255,255,255,0.06)', color:'rgba(232,237,245,0.50)',
        }}>
          <ImageIcon style={{ width:12, height:12 }} />
          <span style={{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedFile.name}</span>
        </div>

        {/* top accent line */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg,transparent,${G}44,transparent)`,
        }} />
      </motion.div>
    )
  }

  return (
    <div
      {...getRootProps()}
      style={{
        borderRadius:16, padding:'40px 24px', textAlign:'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition:'all 0.2s',
        border: drag ? `1.5px dashed rgba(0,255,136,0.50)` : `1.5px dashed rgba(255,255,255,0.08)`,
        background: drag ? 'rgba(0,255,136,0.04)' : 'rgba(255,255,255,0.015)',
        boxShadow: drag ? `inset 0 0 40px rgba(0,255,136,0.04), 0 0 0 1px rgba(0,255,136,0.08)` : 'none',
      }}
    >
      <input {...getInputProps()} />

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <motion.div
          animate={drag ? { scale:1.1, rotate:4 } : { scale:1, rotate:0 }}
          transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
          style={{
            width:56, height:56, borderRadius:14,
            display:'flex', alignItems:'center', justifyContent:'center',
            background: drag ? 'rgba(0,255,136,0.10)' : 'rgba(255,255,255,0.04)',
            border: drag ? `1px solid rgba(0,255,136,0.30)` : '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {drag
            ? <CloudUpload style={{ width:24, height:24, color:G }} />
            : <Upload style={{ width:24, height:24, color:'rgba(232,237,245,0.20)' }} />
          }
        </motion.div>

        <div>
          <p style={{ fontSize:15, fontWeight:600, color:'rgba(232,237,245,0.60)', marginBottom:6 }}>
            {drag ? 'Drop your chart here' : 'Upload chart screenshot'}
          </p>
          <p style={{ fontSize:12, color:'rgba(232,237,245,0.28)' }}>
            Drag &amp; drop or click to browse · PNG, JPG, WebP · max 10MB
          </p>
        </div>

        {/* platform tags */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
          {['TradingView', 'Binance', 'Bybit', 'OKX', 'Any platform'].map(p => (
            <span key={p} style={{
              fontSize:10, padding:'4px 10px', borderRadius:999,
              color:'rgba(232,237,245,0.28)',
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)',
            }}>
              {p}
            </span>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(232,237,245,0.18)' }}>
          <Cpu style={{ width:12, height:12, color:`rgba(0,255,136,0.35)` }} />
          Gemini 2.0 Flash Vision + Claude Sonnet
        </div>
      </div>
    </div>
  )
}
