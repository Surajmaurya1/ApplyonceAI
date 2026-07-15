import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function DropZone({ onFile }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (f) => f[0] && onFile(f[0]),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1',
        isDragActive
          ? 'border-white bg-white/5'
          : 'border-[#262626] hover:border-white/20 bg-[#171717]/20 hover:bg-[#171717]/40'
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto text-white" size={32} />
      <p className="mt-4 font-semibold text-white text-sm">Drop your document here</p>
      <p className="mt-2 text-xs text-[#A1A1AA]">
        PNG, JPG, WEBP or PDF · maximum 10 MB
      </p>
    </div>
  )
}
