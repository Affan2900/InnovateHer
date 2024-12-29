import { render, screen } from '@testing-library/react'
import FixedNavbar from '@/components/FixedNavbar'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

// Mocks
jest.mock('next-auth/react')
jest.mock('next-intl')
jest.mock('@/lib/store/useLocaleStore', () => ({
  __esModule: true,
  default: () => ({ currentLocale: 'en' })
}))
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>
  }
}))
jest.mock('@/components/Profile', () => {
  return function MockProfile({ userName }) {
    return <div data-testid="profile">{userName}</div>
  }
})

describe('FixedNavbar', () => {
  const mockT = jest.fn((key) => key)
  
  beforeEach(() => {
    useTranslations.mockImplementation(() => mockT)
  })

  test('renders login button when user is not authenticated', () => {
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<FixedNavbar />)
    expect(screen.getByText('login')).toBeInTheDocument()
  })

  test('renders profile when user is authenticated', () => {
    useSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Test User',
          currentRole: 'buyer'
        }
      },
      status: 'authenticated'
    })

    render(<FixedNavbar />)
    expect(screen.getByTestId('profile')).toBeInTheDocument()
  })
})