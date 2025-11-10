import * as React from 'react'
import { DocumentItem } from '../types'
import { StatusBadge } from './StatusBadge'
import { SignatureRequestForm } from './SignatureRequestForm'
import { useApp } from '../state/AppContext'
import { Button } from "@/components/ui/button"

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
    else if (signed > 0 || declined > 0) status = 'Partially Signed'
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
          <Button className="btn-outline px-3 py-1 text-sm" onClick={() => deleteDocument(doc.id)}>Delete</Button>
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
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Simulate status update</div>
          <div className="flex gap-2">
            <Button className="btn" onClick={() => simulate('Signed')}>Mark next signer: Signed</Button>
            <Button className="btn-outline" onClick={() => simulate('Declined')}>Mark next signer: Declined</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

