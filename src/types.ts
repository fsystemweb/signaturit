export type DocumentStatus = 'Pending' | 'Signed' | 'Declined'
export type SignerStatus = 'Pending' | 'Signed' | 'Declined'

export interface Signer {
  id: string
  email: string
  status: SignerStatus
  signedDate?: Date
}

export interface DocumentItem {
  id: string
  filename: string
  fileType: string
  fileSize: number
  uploadDate: Date
  status: DocumentStatus
  signers: Signer[]
}

export interface NotificationItem {
  id: string
  type: 'Uploaded' | 'RequestSent' | 'Signed' | 'Declined'
  documentName: string
  signerEmail?: string
  timestamp: Date
}

