import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SignatureRequestForm } from '../../components/SignatureRequestForm'
import { AppProvider, useApp } from '../../state/AppContext'

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

  it('detects duplicate emails', () => {
    render(
      <AppProvider>
        <SignatureRequestForm documentId="doc-1" />
      </AppProvider>
    )
    
    const input = screen.getByPlaceholderText(/Enter emails/)
    fireEvent.change(input, { target: { value: 'john@example.com, jane@example.com, john@example.com' } })
    fireEvent.click(screen.getByText(/Send request/i))
    
    expect(screen.getByText(/Duplicate email\(s\) found: john@example.com/)).toBeInTheDocument()
  })

  it('detects duplicate emails case-insensitively', () => {
    render(
      <AppProvider>
        <SignatureRequestForm documentId="doc-1" />
      </AppProvider>
    )
    
    const input = screen.getByPlaceholderText(/Enter emails/)
    fireEvent.change(input, { target: { value: 'John@Example.com, john@example.com' } })
    fireEvent.click(screen.getByText(/Send request/i))
    
    expect(screen.getByText(/Duplicate email\(s\) found:/)).toBeInTheDocument()
  })

  it('allows multiple unique emails and adds them to state', () => {
    const StateConsumer: React.FC<{ docId: string }> = ({ docId }) => {
      const { documents } = useApp()
      const doc = documents.find(d => d.id === docId)
      
      return (
        <>
          <SignatureRequestForm documentId={docId} />
          <div data-testid="signer-count">{doc?.signers.length || 0}</div>
          {doc?.signers.map(signer => (
            <div key={signer.id} data-testid="signer-email">{signer.email}</div>
          ))}
        </>
      )
    }

    render(
      <AppProvider>
        <StateConsumer docId="doc-1" />
      </AppProvider>
    )
    
    const input = screen.getByPlaceholderText(/Enter emails/)
    fireEvent.change(input, { target: { value: 'newuser1@example.com, newuser2@example.com' } })
    fireEvent.click(screen.getByText(/Send request/i))
    
    // Verify no errors
    expect(screen.queryByText(/Duplicate email\(s\) found:/)).toBeNull()
    expect(screen.queryByText(/Please enter at least one valid email/)).toBeNull()
    
    // Verify emails were added to state
    expect(screen.getByText('newuser1@example.com')).toBeInTheDocument()
    expect(screen.getByText('newuser2@example.com')).toBeInTheDocument()
  })

  it('prevents duplicate emails already in document state', () => {
    const StateConsumer: React.FC<{ docId: string }> = ({ docId }) => {
      const { documents } = useApp()
      return <SignatureRequestForm documentId={docId} />
    }

    render(
      <AppProvider>
        <StateConsumer docId="doc-1" />
      </AppProvider>
    )
    
    const input = screen.getByPlaceholderText(/Enter emails/)
    // Try to add an email that already exists in the mock data (john.doe@example.com from Contract_2024.pdf)
    fireEvent.change(input, { target: { value: 'john.doe@example.com, jane@example.com, john.doe@example.com' } })
    fireEvent.click(screen.getByText(/Send request/i))
    
    expect(screen.getByText(/Duplicate email\(s\) found: john.doe@example.com/)).toBeInTheDocument()
  })
})