import { render, screen, fireEvent } from '@testing-library/react'
import Profile from '@/components/Profile'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'

jest.mock('next-auth/react')
jest.mock('next-intl')
jest.mock('@/lib/store/useLocaleStore', () => ({
  __esModule: true,
  default: () => ({ currentLocale: 'en' })
}))
jest.mock('@/lib/store/useRoleStore', () => ({
  __esModule: true,
  default: () => ({ currentRole: 'user' }),
  useSyncRoleWithSession: jest.fn()
}))
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>
})
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => children
}))

describe('Profile', () => {
  const mockT = jest.fn((key) => key)
  const mockSignOut = jest.fn()

  beforeEach(() => {
    useTranslations.mockImplementation(() => mockT)
    useSession.mockReturnValue({
      data: {
        user: {
          id: '123',
          name: 'Test User'
        }
      },
      status: 'authenticated'
    })
    signOut.mockImplementation(mockSignOut)
  })

  test('renders profile with user initials', () => {
    render(<Profile userName="Test User" />)
    expect(screen.getByText('TU')).toBeInTheDocument()
  })

  test('opens dropdown menu when clicked', () => {
    render(<Profile userName="Test User" />)
    
    fireEvent.click(screen.getByText('TU'))
    
    expect(screen.getByText('Current Role: user')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('changeRole')).toBeInTheDocument()
    expect(screen.getByText('logout')).toBeInTheDocument()
  })

  test('calls signOut when logout is clicked', () => {
    render(<Profile userName="Test User" />)
    
    fireEvent.click(screen.getByText('TU'))
    fireEvent.click(screen.getByText('logout'))
    
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/en' })
  })

  test('calls signOut when change role is clicked', () => {
    render(<Profile userName="Test User" />)
    
    fireEvent.click(screen.getByText('TU'))
    fireEvent.click(screen.getByText('changeRole'))
    
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/en/login' })
  })

  test('renders correct dashboard link', () => {
    render(<Profile userName="Test User" />)
    
    fireEvent.click(screen.getByText('TU'))
    
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('href', '/en/123/dashboard')
  })
})