import * as React from 'react'
import { DocumentStatus, SignerStatus } from '../types'
import { Badge } from "@/components/ui/badge"

export const StatusBadge: React.FC<{ status: DocumentStatus | SignerStatus }> = ({ status }) => {
  const getStyle = (status: DocumentStatus | SignerStatus): string => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500 text-white hover:bg-yellow-600'
      case 'Signed':
        return 'bg-blue-500 text-white hover:bg-blue-600'
      case 'Declined':
        return 'bg-red-500 text-white hover:bg-red-600'
      default:
        return 'default'
    }
  }

  return <Badge className={getStyle(status)}>{status}</Badge>
}