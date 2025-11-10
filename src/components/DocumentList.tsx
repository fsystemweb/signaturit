import React from 'react'
import { useApp } from '../state/AppContext'
import { DocumentCard } from './DocumentCard'
import { DocumentItem } from '../types'
import { StatusBadge } from './StatusBadge'

type SortKey = 'date' | 'status'

export const DocumentList: React.FC = () => {
  const { documents, filter, setFilter } = useApp()
  const [sortBy, setSortBy] = React.useState<SortKey>('date')

  const filtered = documents.filter(d => (filter === 'All' ? true : d.status === filter))

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
            <button
              key={f}
              className={`px-3 py-1 rounded-md border text-sm ${filter === f ? 'bg-gray-900 text-white' : 'bg-white'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by</label>
          <select
            className="input py-1 h-9 w-40"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortKey)}
          >
            <option value="date">Upload date</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Table on desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border text-sm">
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

      {/* Cards on mobile */}
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
          <button className="btn-outline px-3 py-1 text-sm" onClick={() => setOpen(v => !v)}>
            {open ? 'Hide' : 'View'}
          </button>
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

