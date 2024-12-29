import { render, screen } from '@testing-library/react'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

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

describe('Navbar', () => {
  const mockT = jest.fn((key) => key)
  
  beforeEach(() => {
    useTranslations.mockImplementation(() => mockT)
  })

  test('renders correctly when visible', () => {
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<Navbar isVisible={true} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('renders profile for authenticated user', () => {
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

    render(<Navbar isVisible={true} />)
    expect(screen.getByTestId('profile')).toBeInTheDocument()
  })
})