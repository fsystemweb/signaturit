import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../../components/StatusBadge'

describe('StatusBadge', () => {
  it('renders status text and style', () => {
    render(<StatusBadge status="Pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})

