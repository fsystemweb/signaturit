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
    let firstDocId: string = ''

    const Seed: React.FC = () => {
      const { addUploadedDocument } = useApp()
      if (!firstDocId) {
        const file = new File([new Blob(['x'], { type: 'application/pdf' })], 'test.pdf', { type: 'application/pdf' })
        const doc = addUploadedDocument(file)
        firstDocId = doc.id
      }
      return null
    }

    const StateConsumer: React.FC = () => {
      const { documents } = useApp()
      const doc = documents.length > 0 ? documents[0] : null
      
      return (
        <>
          {doc && <SignatureRequestForm documentId={doc.id} />}
          <div data-testid="signer-count">{doc?.signers.length || 0}</div>
          {doc?.signers.map(signer => (
            <div key={signer.id} data-testid="signer-email">{signer.email}</div>
          ))}
        </>
      )
    }

    render(
      <AppProvider>
        <Seed />
        <StateConsumer />
      </AppProvider>
    )
    
    const input = screen.getByPlaceholderText(/Enter emails/)
    fireEvent.change(input, { target: { value: 'newuser1@example.com, newuser2@example.com' } })
    fireEvent.click(screen.getByText(/Send request/i))
    
    // Verify no errors
    expect(screen.queryByText(/Duplicate email\(s\) found:/)).toBeNull()
    expect(screen.queryByText(/Please enter at least one valid email/)).toBeNull()
    
    // Verify emails were added to state
    const signersEmails = screen.getAllByTestId('signer-email')
    expect(signersEmails).toHaveLength(2)
    expect(signersEmails[0]).toHaveTextContent('newuser1@example.com')
    expect(signersEmails[1]).toHaveTextContent('newuser2@example.com')
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
    fireEvent.change(input, { target: { value: 'john.doe@example.com, jane@example.com, john.doe@example.com' } })
    fireEvent.click(screen.getByText(/Send request/i))
    
    expect(screen.getByText(/Duplicate email\(s\) found: john.doe@example.com/)).toBeInTheDocument()
  })
})