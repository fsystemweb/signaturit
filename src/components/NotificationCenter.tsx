import * as React from 'react'
import * as Toast from '@radix-ui/react-toast'
import { useApp } from '../state/AppContext'
import { format } from 'date-fns'

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useApp()
  const [openId, setOpenId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (notifications.length > 0) {
      setOpenId(notifications[0].id)
    }
  }, [notifications])

  const current = notifications[0]
  if (!current) return null

  const onOpenChange = (open: boolean) => {
    if (!open) {
      removeNotification(current.id)
      setOpenId(null)
    }
  }

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="fixed bottom-4 right-4 z-50 w-80 rounded-md border border-gray-200 bg-white p-4 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out"
        open={openId === current.id}
        onOpenChange={onOpenChange}
        duration={5000}
      >
        <Toast.Title className="mb-1 font-medium">
          {current.type}: {current.documentName}
        </Toast.Title>
        <Toast.Description className="text-sm text-gray-600">
          {current.signerEmail ? `Signer: ${current.signerEmail}` : null}
          <div className="text-xs mt-1">{format(current.timestamp, 'PPpp')}</div>
        </Toast.Description>
        <div className="mt-3 flex justify-end">
          <Toast.Close className="btn btn-outline px-3 py-1 text-xs">Close</Toast.Close>
        </div>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-50 m-0 flex w-[420px] max-w-[100vw] list-none flex-col gap-2 p-6 outline-none" />
    </Toast.Provider>
  )
}

