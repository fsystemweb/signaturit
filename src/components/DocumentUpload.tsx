import * as React from 'react'
import { useApp } from '../state/AppContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

const MAX_SIZE = 10 * 1024 * 1024

export const DocumentUpload: React.FC = () => {
  const { addUploadedDocument } = useApp()
  const [error, setError] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState<number>(0)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = React.useState(false)

  const validate = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type) && !isAllowedByName(file.name)) {
      return 'Unsupported file type. Allowed: PDF, DOC, DOCX, XLSX.'
    }
    if (file.size > MAX_SIZE) {
      return 'File too large. Max 10MB.'
    }
    return null
  }

  const handleFiles = async (files: FileList | { files: File[] } | File[] | null) => {
    if (!files) return
    const list = Array.isArray(files) ? files : (files as any).length !== undefined ? (files as any) : (files as any).files
    if (!list || list.length === 0) return
    const file = list[0] as File
    const v = validate(file)
    if (v) {
      setError(v)
      return
    }
    setError(null)
    setProgress(0)
    // Simulate upload
    const start = Date.now()
    const duration = 600 + Math.random() * 1000
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(interval)
        addUploadedDocument(file)
        setTimeout(() => setProgress(0), 400)
      }
    }, 100)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }
  const onDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-6">
      <div
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-md p-8 text-center ${dragActive ? 'bg-gray-50' : ''}`}
      >
        <div className="text-sm text-gray-600">
          Drag and drop a file here, or
          <Button
            className="ml-1 underline"
            aria-label="browse"
            onClick={() => inputRef.current?.click()}
          >
            browse
          </Button>
        </div>
        <Input
          ref={inputRef}
          className="hidden"
          type="file"
          accept=".pdf,.doc,.docx,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={e => handleFiles(e.target.files)}
        />
        <div className="text-xs text-gray-500">Max size 10MB</div>
        {progress > 0 ? (
          <div className="w-full max-w-md">
            <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
              <div className="h-2 bg-gray-900 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-1 text-right text-xs text-gray-600">{progress}%</div>
          </div>
        ) : null}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>
    </div>
  )
}

const isAllowedByName = (name: string): boolean =>{
  const n = name.toLowerCase()
  return n.endsWith('.pdf') || n.endsWith('.doc') || n.endsWith('.docx') || n.endsWith('.xlsx')
}

