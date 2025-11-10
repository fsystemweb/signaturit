import * as React from 'react'
import { toast } from 'sonner'
import { useApp } from '../state/AppContext'
import { format } from 'date-fns'

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useApp()
  const toastIdRef = React.useRef<string | number | null>(null)

  React.useEffect(() => {
    if (notifications.length > 0) {
      const current = notifications[0]
      
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current)
      }

      toastIdRef.current = toast(
        <div>
          <div className="font-medium">
            {current.type}: {current.documentName}
          </div>
          {current.signerEmail && (
            <div className="text-sm text-gray-600">Signer: {current.signerEmail}</div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {format(current.timestamp, 'PPpp')}
          </div>
        </div>,
        {
          duration: 5000,
          onDismiss: () => {
            removeNotification(current.id)
            toastIdRef.current = null
          },
        }
      )
    }
  }, [notifications, removeNotification])

  return null
}