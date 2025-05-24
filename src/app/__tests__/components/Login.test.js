import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '@/app/[locale]/login/page.jsx'

// Mock dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key => key)
}))
jest.mock('@/components/FixedNavbar', () => () => <div data-testid="fixed-navbar" />)
jest.mock('@/components/LanguageToggle', () => () => <div data-testid="language-toggle" />)
jest.mock('next/link', () => ({ children, href }) => <a href={href}>{children}</a>)
const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh
  })
}))
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
  signIn: jest.fn(() => Promise.resolve({ ok: true }))
}))
jest.mock('@/lib/store/useLocaleStore', () => ({
  __esModule: true,
  default: () => ({ currentLocale: 'en' })
}))
jest.mock('@/lib/store/useRoleStore', () => ({
  __esModule: true,
  default: () => ({
    currentRole: 'buyer',
    setRole: jest.fn()
  })
}))

describe('Login page', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockRefresh.mockClear()
    require('next-auth/react').signIn.mockClear()
  })

  test('renders login heading and form fields', () => {
    render(<Login />)
    expect(screen.getByText('login')).toBeInTheDocument()
    expect(screen.getByLabelText('email')).toBeInTheDocument()
    expect(screen.getByLabelText('password')).toBeInTheDocument()
    expect(screen.getByLabelText('role')).toBeInTheDocument()
  })

  test('renders register link', () => {
    render(<Login />)
    expect(screen.getByText('registerHere')).toBeInTheDocument()
  })

  test('calls signIn and refreshes on successful login', async () => {
    render(<Login />)
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('role'), { target: { value: 'seller' } })
    fireEvent.click(screen.getByRole('button', { name: 'loginButton' }))
    await waitFor(() => {
      expect(require('next-auth/react').signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'test@example.com',
        password: 'password123',
        role: 'seller',
        redirect: false
      }))
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  test('shows error message on failed login', async () => {
    require('next-auth/react').signIn.mockImplementationOnce(() => Promise.resolve({ ok: false, error: 'Invalid credentials' }))
    render(<Login />)
    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'fail@example.com' } })
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'loginButton' }))
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  test('renders navbar and language toggle', () => {
    render(<Login />)
    expect(screen.getByTestId('fixed-navbar')).toBeInTheDocument()
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
  })
})