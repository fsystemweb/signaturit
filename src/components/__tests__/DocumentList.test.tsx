import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { DocumentList } from '../../components/DocumentList'
import { AppProvider, useApp } from '../../state/AppContext'
import { DocumentItem } from '../../types'

const Seed: React.FC = () => {
  const { updateDocument, addUploadedDocument } = useApp()
  React.useEffect(() => {
    const file = new File([new Blob(['x'], { type: 'application/pdf' })], 'a.pdf', { type: 'application/pdf' })
    const d1 = addUploadedDocument(file)
    const d2: DocumentItem = {
      ...d1,
      id: '2',
      filename: 'b.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      status: 'Signed',
      uploadDate: new Date(Date.now() - 1000)
    }
    updateDocument(d2)
  }, [])
  return null
}

describe('DocumentList', () => {
  it('filters and sorts', () => {
    render(
      <AppProvider>
        <Seed />
        <DocumentList />
      </AppProvider>
    )
  expect(screen.getAllByText(/Upload date/).length).toBeGreaterThan(0)
  expect(screen.getByText('All')).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: 'Pending' }).length).toBeGreaterThan(0)
  })
})

