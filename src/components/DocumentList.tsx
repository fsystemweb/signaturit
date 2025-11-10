import * as React from 'react'
import { useApp } from '../state/AppContext'
import { DocumentCard } from './DocumentCard'
import { DocumentItem } from '../types'
import { StatusBadge } from './StatusBadge'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortKey = 'date' | 'status'

export const DocumentList: React.FC = () => {
  const { documents, filter, setFilter } = useApp()
  const [sortBy, setSortBy] = React.useState<SortKey>('date')

  const filtered = documents.filter(item => (filter === 'All' ? true : item.status === filter))

  const sorted = React.useMemo(() => {
    const arr = [...filtered]
    if (sortBy === 'date') {
      arr.sort((a, b) => +new Date(b.uploadDate) - +new Date(a.uploadDate))
    } else {
      const order = { Pending: 0, 'Partially Signed': 1, Signed: 2, Declined: 3 } as Record<string, number>
      arr.sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99))
    }
    return arr
  }, [filtered, sortBy])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Signed', 'Declined'] as const).map(f => (
            <Button
              key={f}
              className={`px-3 py-1 borderRadius-lg border text-sm ${filter === f ? 'bg-gray-900 text-white' : 'bg-white text-black hover:text-white'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by</label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortKey)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Upload date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left border-b">Name</th>
              <th className="px-3 py-2 text-left border-b">Upload date</th>
              <th className="px-3 py-2 text-left border-b">Status</th>
              <th className="px-3 py-2 text-left border-b">Signers</th>
              <th className="px-3 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(doc => (
              <Row key={doc.id} doc={doc} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-3">
        {sorted.map(doc => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  )
}

const Row: React.FC<{ doc: DocumentItem }> = ({ doc }) => {
  const [open, setOpen] = React.useState(false)
  const signedCount = doc.signers.filter(s => s.status === 'Signed').length
  const progressLabel = `${signedCount} of ${doc.signers.length} signed`
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-3 py-2 border-b">{doc.filename}</td>
        <td className="px-3 py-2 border-b">{new Date(doc.uploadDate).toLocaleString()}</td>
        <td className="px-3 py-2 border-b"><StatusBadge status={doc.status} /></td>
        <td className="px-3 py-2 border-b">{progressLabel}</td>
        <td className="px-3 py-2 border-b">
          <Button className="btn-outline px-3 py-1 text-sm" onClick={() => setOpen(v => !v)}>
            {open ? 'Hide' : 'View'}
          </Button>
        </td>
      </tr>
      {open ? (
        <tr>
          <td colSpan={5} className="px-3 py-3 border-b bg-gray-50">
            <DocumentCard doc={doc} />
          </td>
        </tr>
      ) : null}
    </>
  )
}

