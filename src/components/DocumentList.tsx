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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
      const order = { Pending: 0, Signed: 1, Declined: 2 } as Record<string, number>
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
              variant={filter === f ? 'default' : 'outline'}
              className="px-3 py-1 text-sm"
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

      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Upload date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signers</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(doc => (
              <Row key={doc.id} doc={doc} />
            ))}
          </TableBody>
        </Table>
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
      <TableRow>
        <TableCell>{doc.filename}</TableCell>
        <TableCell>{new Date(doc.uploadDate).toLocaleString()}</TableCell>
        <TableCell><StatusBadge status={doc.status} /></TableCell>
        <TableCell>{progressLabel}</TableCell>
        <TableCell>
          <Button variant="outline" size="sm" onClick={() => setOpen(v => !v)}>
            {open ? 'Hide' : 'View'}
          </Button>
        </TableCell>
      </TableRow>
      {open && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted">
            <DocumentCard doc={doc} />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}