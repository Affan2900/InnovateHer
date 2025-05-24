import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Register from '@/app/[locale]/register/page.jsx'

// Mock dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key => key)
}))
jest.mock('@/components/FixedNavbar', () => () => <div data-testid="fixed-navbar" />)
jest.mock('@/components/LanguageToggle', () => () => <div data-testid="language-toggle" />)
jest.mock('next/link', () => ({ children, href }) => <a href={href}>{children}</a>)
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  usePathname: () => '/en/register'
}))

describe('Register page', () => {
  beforeEach(() => {
    mockPush.mockClear()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    )
  })

  test('renders register heading and form fields', () => {
    render(<Register />)
    expect(screen.getByText('register')).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toBeInTheDocument()
    expect(screen.getByLabelText('email')).toBeInTheDocument()
    expect(screen.getByLabelText('password')).toBeInTheDocument()
  })

  test('renders already have account link', () => {
    render(<Register />)
    expect(screen.getByText('alreadyHaveAccount')).toBeInTheDocument()
    expect(screen.getByText('loginHere')).toBeInTheDocument()
  })

  test('submits form and redirects on success', async () => {
    render(<Register />)
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'registerButton' }))
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/login')
    })
  })

  test('shows error message on failed registration', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Email already exists' })
      })
    )
    render(<Register />)
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'registerButton' }))
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument()
    })
  })

  test('renders navbar and language toggle', () => {
    render(<Register />)
    expect(screen.getByTestId('fixed-navbar')).toBeInTheDocument()
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
  })
})