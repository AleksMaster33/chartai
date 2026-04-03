'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface UploadZoneProps {
  onFileSelect: (file: File, preview: string) => void
  selectedFile: File | null
  preview: string | null
  onClear: () => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, selectedFile, preview, onClear, disabled }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onFileSelect(file, url)
  }, [onFileSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  })

  if (preview && selectedFile) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-white/10 group">
        <Image
          src={preview}
          alt="Chart preview"
          width={800}
          height={400}
          className="w-full object-contain max-h-64 bg-black"
          style={{ objectFit: 'contain' }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white/60">
          <ImageIcon className="w-3 h-3 inline mr-1" />
          {selectedFile.name}
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`upload-zone rounded-xl p-10 cursor-pointer text-center transition-all ${
        dragActive ? 'active' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
          dragActive
            ? 'bg-lime-400/20 border border-lime-400/40'
            : 'bg-white/[0.05] border border-white/[0.08]'
        }`}>
          <Upload className={`w-6 h-6 ${dragActive ? 'text-lime-400' : 'text-white/40'}`} />
        </div>
        <div>
          <p className="font-medium text-white/80 mb-1">
            {dragActive ? 'Drop your chart here' : 'Upload a chart screenshot'}
          </p>
          <p className="text-sm text-white/40">
            Drag & drop or click · PNG, JPG, WebP · Max 10MB
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          {['TradingView', 'Binance', 'Bybit', 'Any platform'].map((p) => (
            <span key={p} className="text-xs bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1 text-white/40">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
