import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key => key === 'description' ? 'Test description' : key)
}))

describe('Footer', () => {
  test('renders InnovateHer brand', () => {
    render(<Footer />)
    expect(screen.getByText('InnovateHer')).toBeInTheDocument()
  })

  test('renders description from translations', () => {
    render(<Footer />)
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  test('renders Instagram and Facebook links', () => {
    render(<Footer />)
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
  })

  test('renders copyright', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })
})