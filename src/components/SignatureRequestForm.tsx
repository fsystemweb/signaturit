import * as React from 'react'
import { useApp } from '../state/AppContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from 'lucide-react'

export const SignatureRequestForm: React.FC<{ documentId: string }> = ({ documentId }) => {
  const { sendSignatureRequest, documents } = useApp()
  const [emailsText, setEmailsText] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emails = parseEmails(emailsText)
    
    if (emails.length === 0) {
      setError('Please enter at least one valid email.')
      return
    }

    const duplicates = findDuplicates(emails)
    if (duplicates.length > 0) {
      setError(`Duplicate email(s) found: ${duplicates.join(', ')}`)
      return
    }

    const doc = documents.find(d => d.id === documentId)
    const existingEmails = doc?.signers.map(s => s.email.toLowerCase()) || []
    const conflictingEmails = emails.filter(email => 
      existingEmails.includes(email.toLowerCase())
    )
    
    if (conflictingEmails.length > 0) {
      setError(`Email(s) already added to this document: ${conflictingEmails.join(', ')}`)
      return
    }

    setError(null)
    sendSignatureRequest(
      documentId,
      emails.map(email => ({ email })),
      message
    )
    setEmailsText('')
    setMessage('')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="text-sm font-medium">Signer email(s)</label>
      <Input
        placeholder="Enter emails separated by commas"
        value={emailsText}
        onChange={e => setEmailsText(e.target.value)}
      />
      <label className="text-sm font-medium">Message (optional)</label>
      <Textarea
        className="min-h-[80px]"
        placeholder="Add a message to the signers"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <div>
        <Button className="btn" type="submit">
          <SendHorizontal size={16} /> Send request
        </Button>
      </div>
    </form>
  )
}

const parseEmails = (input: string): string[] => {
  const parts = input.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean)
  return parts.filter(isValidEmail)
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const findDuplicates = (emails: string[]): string[] => {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  
  for (const email of emails) {
    const lowerEmail = email.toLowerCase()
    if (seen.has(lowerEmail)) {
      duplicates.add(lowerEmail)
    }
    seen.add(lowerEmail)
  }
  
  return Array.from(duplicates)
}