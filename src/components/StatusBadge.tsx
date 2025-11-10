import * as React from 'react'
import { DocumentStatus, SignerStatus } from '../types'

export const StatusBadge: React.FC<{ status: DocumentStatus | SignerStatus }> = ({ status }) => {
  const className =
    status === 'Pending'
      ? 'badge badge-pending'
      : status === 'Signed'
      ? 'badge badge-signed'
      : status === 'Declined'
      ? 'badge badge-declined'
      : 'badge badge-partial'
  return <span className={className}>{status}</span>
}

