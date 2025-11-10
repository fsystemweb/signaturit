import * as React from 'react'
import { DocumentItem } from '../types'
import { StatusBadge } from './StatusBadge'
import { SignatureRequestForm } from './SignatureRequestForm'
import { useApp } from '../state/AppContext'
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react';
import { Signature } from 'lucide-react';
import { X } from 'lucide-react';


export const DocumentCard: React.FC<{ doc: DocumentItem }> = ({ doc }) => {
  const { deleteDocument, updateDocument, notify } = useApp()

  const signedCount = doc.signers.filter(s => s.status === 'Signed').length
  const progressLabel = `${signedCount} of ${doc.signers.length} signed`

  const simulate = (type: 'Signed' | 'Declined') => {
    const pending = doc.signers.find(s => s.status === 'Pending')
    if (!pending) return
    const updated = {
      ...doc,
      signers: doc.signers.map(s =>
        s.id === pending.id ? { ...s, status: type, signedDate: new Date() } : s
      )
    }
    const total = updated.signers.length
    const signed = updated.signers.filter(s => s.status === 'Signed').length
    const declined = updated.signers.filter(s => s.status === 'Declined').length
    let status = updated.status
    if (signed === total) status = 'Signed'
    else if (declined === total) status = 'Declined'
    updateDocument({ ...updated, status })
    notify({ type, documentName: doc.filename, signerEmail: pending.email })
  }

  return (
    <div className="rounded-lg border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{doc.filename}</div>
          <div className="text-xs text-gray-500">
            {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.uploadDate).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={doc.status} />
          <Button
            size="sm"
            className="text-sm text-white hidden md:flex gap-2"
            onClick={() => deleteDocument(doc.id)}
          >
            <Trash size={16} />
            Delete
          </Button>

          <Button
            size="icon"
            className="text-sm text-white  md:hidden"
            onClick={() => deleteDocument(doc.id)}
            title="Delete"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-700">{progressLabel}</div>

      <div className="flex flex-wrap gap-2">
        {doc.signers.map(s => (
          <span key={s.id} className="rounded-md border px-2 py-1 text-xs">
            {s.email} • <StatusBadge status={s.status} />
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SignatureRequestForm documentId={doc.id} />
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="text-sm font-medium">Simulate status update</div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-sm text-white hidden md:flex gap-2 bg-green-500 hover:bg-green-600"
              onClick={() => simulate('Signed')}
            >
              <Signature size={16} />
              Mark as Signed
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="text-sm text-white  md:hidden bg-green-500 hover:bg-green-600" 
              onClick={() => simulate('Signed')} title="Mark as Signed"
            >
              <Signature size={16} />
            </Button>


            <Button
              size="sm"
              className="text-sm text-white hidden md:flex gap-2 bg-red-500 hover:bg-red-600"
              onClick={() => simulate('Declined')}
            >
              <X size={16} />
              Mark as Declined
            </Button>
            <Button
              size="icon"
              className="text-sm text-white  md:hidden bg-red-500 hover:bg-red-600"
              onClick={() => simulate('Declined')} title="Mark as Declined"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

