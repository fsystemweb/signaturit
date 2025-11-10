import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DocumentUpload } from '../../components/DocumentUpload'
import { AppProvider } from '../../state/AppContext'

function renderWithProvider(ui: React.ReactElement) {
  return render(<AppProvider>{ui}</AppProvider>)
}

function createFile(name: string, size: number, type: string) {
  const blob = new Blob(['a'.repeat(size)], { type })
  return new File([blob], name, { type })
}

describe('DocumentUpload', () => {
  it('rejects files over 10MB', async () => {
    renderWithProvider(<DocumentUpload />)
    const input = screen.getByLabelText(/browse/i) as HTMLButtonElement
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = createFile('big.pdf', 10 * 1024 * 1024 + 1, 'application/pdf')
    const dt = { files: [file] } as unknown as FileList
    Object.defineProperty(fileInput, 'files', { value: dt })
    fireEvent.change(fileInput)
    expect(await screen.findByText(/File too large/)).toBeInTheDocument()
  })

  it('accepts valid PDF and shows progress', async () => {
    renderWithProvider(<DocumentUpload />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = createFile('ok.pdf', 100, 'application/pdf')
    const dt = { files: [file] } as unknown as FileList
    Object.defineProperty(fileInput, 'files', { value: dt })
    fireEvent.change(fileInput)
    expect(await screen.findByText(/%/)).toBeInTheDocument()
    await waitFor(() => {
      const pct = screen.queryByText(/%/)
      expect(pct).toBeNull()
    }, { timeout: 4000 })
  })
})

