'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, X, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface UploadZoneProps {
  onFileSelect: (file: File, preview: string) => void
  selectedFile: File | null
  preview: string | null
  onClear: () => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, selectedFile, preview, onClear, disabled }: UploadZoneProps) {
  const [drag, setDrag] = useState(false)

  const onDrop = useCallback((files: File[]) => {
    const f = files[0]
    if (f) onFileSelect(f, URL.createObjectURL(f))
  }, [onFileSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png','.jpg','.jpeg','.webp'] },
    maxFiles: 1, maxSize: 10*1024*1024, disabled,
    onDragEnter: () => setDrag(true),
    onDragLeave: () => setDrag(false),
    onDropAccepted: () => setDrag(false),
    onDropRejected: () => setDrag(false),
  })

  if (preview && selectedFile) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] group cursor-pointer">
        <Image src={preview} alt="Chart" width={800} height={400}
          className="w-full object-contain max-h-72 bg-black" style={{ objectFit: 'contain' }} />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button onClick={e => { e.stopPropagation(); onClear() }}
            className="glass border border-white/20 rounded-full p-2.5 hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 glass border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs text-white/50 font-display truncate max-w-[200px]">{selectedFile.name}</span>
        </div>
      </div>
    )
  }

  return (
    <div {...getRootProps()}
      className={`upload-zone rounded-2xl p-10 cursor-pointer text-center select-none ${drag ? 'drag-active' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          drag ? 'bg-[#84cc16]/20 border border-[#84cc16]/40 scale-110' : 'glass border border-white/[0.08]'
        }`}>
          <Upload className={`w-7 h-7 transition-colors duration-300 ${drag ? 'text-[#84cc16]' : 'text-white/25'}`} />
        </div>

        <div>
          <p className="font-display font-semibold text-white/70 mb-1.5">
            {drag ? 'Drop chart here' : 'Upload chart screenshot'}
          </p>
          <p className="text-sm text-white/30">Drag & drop or click · PNG, JPG, WebP · max 10MB</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {['TradingView', 'Binance', 'Bybit', 'OKX', 'Any platform'].map(p => (
            <span key={p} className="text-xs glass border border-white/[0.06] rounded-full px-3 py-1 text-white/30 font-display">
              {p}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/20 font-display">
          <Sparkles className="w-3 h-3 text-[#84cc16]/50" />
          Powered by Gemini Vision + Claude Osiris
        </div>
      </div>
    </div>
  )
}
