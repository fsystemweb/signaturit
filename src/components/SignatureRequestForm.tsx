import * as React from 'react'
import { useApp } from '../state/AppContext'

export const SignatureRequestForm: React.FC<{ documentId: string }> = ({ documentId }) => {
  const { sendSignatureRequest } = useApp()
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
      <input
        className="input"
        placeholder="Enter emails separated by commas"
        value={emailsText}
        onChange={e => setEmailsText(e.target.value)}
      />
      <label className="text-sm font-medium">Message (optional)</label>
      <textarea
        className="input min-h-[80px]"
        placeholder="Add a message to the signers"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      <div>
        <button className="btn" type="submit">Send signature request</button>
      </div>
    </form>
  )
}

function parseEmails(input: string): string[] {
  const parts = input.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean)
  return parts.filter(isValidEmail)
}

function isValidEmail(email: string): boolean {
  // Simple RFC5322-ish regex good enough for UI validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

