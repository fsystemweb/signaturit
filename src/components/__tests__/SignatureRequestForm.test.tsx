import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SignatureRequestForm } from '../../components/SignatureRequestForm'
import { AppProvider } from '../../state/AppContext'

describe('SignatureRequestForm', () => {
  it('validates email input', () => {
    render(
      <AppProvider>
        <SignatureRequestForm documentId="doc-1" />
      </AppProvider>
    )
  fireEvent.click(screen.getByText(/Send request/i))
    expect(screen.getByText(/Please enter at least one valid email/)).toBeInTheDocument()
    const input = screen.getByPlaceholderText(/Enter emails/)
    fireEvent.change(input, { target: { value: 'test@example.com, invalid' } })
  fireEvent.click(screen.getByText(/Send request/i))
    expect(screen.queryByText(/Please enter at least one valid email/)).toBeNull()
  })
})

