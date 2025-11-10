import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { App } from '../pages/App'
import { AppProvider } from '../state/AppContext'

function createFile(name: string, size: number, type: string) {
  const blob = new Blob(['a'.repeat(size)], { type })
  return new File([blob], name, { type })
}

describe('Integration: upload -> request -> notification', () => {
  it('uploads and sends a request, showing a toast', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    )
    // Upload a file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = createFile('ok.pdf', 100, 'application/pdf')
    Object.defineProperty(fileInput, 'files', { value: { 0: file, length: 1, item: () => file } })
    fireEvent.change(fileInput)
    // wait for upload to finish; progress disappears
    await waitFor(() => {
      const pct = screen.queryByText(/%/)
      expect(pct).toBeNull()
    }, { timeout: 4000 })

    // There should be a documents section entry
    expect(screen.getByText(/Documents/)).toBeInTheDocument()

  // Open first row if on desktop table is rendered (it might render card on jsdom width; rely on form presence)
  // wait for the email input to appear (upload -> list render is async)
  const emailInput = await screen.findByPlaceholderText(/Enter emails/i)
    fireEvent.change(emailInput, { target: { value: 'a@example.com' } })
    fireEvent.click(screen.getByText(/Send signature request/i))

    // A toast for RequestSent should appear
    await waitFor(() => {
      expect(screen.getByText(/RequestSent:/)).toBeInTheDocument()
    })
  })
})

