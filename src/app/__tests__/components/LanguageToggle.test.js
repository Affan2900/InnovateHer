import { render, screen, fireEvent } from '@testing-library/react'
import LanguageToggle from '@/components/LanguageToggle'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  usePathname: () => '/en/test'
}))

jest.mock('@/lib/store/useLocaleStore', () => ({
  __esModule: true,
  default: () => ({
    currentLocale: 'en',
    setLocale: jest.fn()
  })
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    select: ({ children, ...props }) => <select {...props}>{children}</select>
  }
}))

describe('LanguageToggle', () => {
  test('renders language options', () => {
    render(<LanguageToggle />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  test('handles language change', () => {
    render(<LanguageToggle />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ur' } })
    // Add expectations based on your requirements
  })
})