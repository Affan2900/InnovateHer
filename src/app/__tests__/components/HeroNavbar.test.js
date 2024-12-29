import { render, screen } from '@testing-library/react'
import HeroNavbar from '@/components/HeroNavbar'
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
    div: ({ children, className, ...props }) => (
      <div className={className}>{children}</div>
    ),
    button: ({ children, className, whileHover, whileTap, ...props }) => (
      <button className={className} {...props}>
        {children}
      </button>
    ),
    li: ({ children, className, ...props }) => (
      <li className={className}>{children}</li>
    )
  },
  AnimatePresence: ({ children }) => children
}))
jest.mock('@/components/LanguageToggle', () => {
  return function MockLanguageToggle() {
    return <div data-testid="language-toggle">LanguageToggle</div>
  }
})
jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>
})

describe('HeroNavbar', () => {
  const mockT = jest.fn((key) => key)
  
  beforeEach(() => {
    useTranslations.mockImplementation(() => mockT)
  })

  test('renders correctly for unauthenticated user', () => {
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<HeroNavbar />)
    
    // Check navigation title
    const navTitle = screen.getByText('title', { selector: 'span' })
    expect(navTitle).toBeInTheDocument()
    
    // Check hero title and subtitle
    const heroTitle = screen.getByText('title', { selector: 'h1' })
    expect(heroTitle).toBeInTheDocument()
    expect(screen.getByText('heroSubtitle')).toBeInTheDocument()
    
    // Check buttons with correct links for unauthenticated user
    const marketplaceLink = screen.getByRole('link', { name: 'exploreMarketplace' })
    expect(marketplaceLink).toHaveAttribute('href', '/en/marketplace')
    
    const learningLink = screen.getByRole('link', { name: 'startLearning' })
    expect(learningLink).toHaveAttribute('href', '/en/skill-building')
    
    // Check impact stats
    expect(screen.getByText('impactTitle')).toBeInTheDocument()
    expect(screen.getByText('impactStat1')).toBeInTheDocument()
    expect(screen.getByText('impactStat2')).toBeInTheDocument()
    expect(screen.getByText('impactStat3')).toBeInTheDocument()
    
    // Check scroll prompt
    expect(screen.getByText('scrollPrompt')).toBeInTheDocument()
    
    // Check language toggle
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
  })

  test('renders correctly for authenticated user', () => {
    useSession.mockReturnValue({
      data: {
        user: {
          id: '123',
          name: 'Test User'
        }
      },
      status: 'authenticated'
    })

    render(<HeroNavbar />)
    
    // Check buttons with correct links for authenticated user
    const marketplaceLink = screen.getByRole('link', { name: 'exploreMarketplace' })
    expect(marketplaceLink).toHaveAttribute('href', '/en/123/marketplace')
    
    const learningLink = screen.getByRole('link', { name: 'startLearning' })
    expect(learningLink).toHaveAttribute('href', '/en/123/skill-building')
  })

  test('renders impact stats section', () => {
    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<HeroNavbar />)
    
    const impactSection = screen.getByRole('heading', { name: 'impactTitle' })
    expect(impactSection).toBeInTheDocument()

    const impactStats = [
      screen.getByText('impactStat1'),
      screen.getByText('impactStat2'),
      screen.getByText('impactStat3')
    ]
    impactStats.forEach(stat => {
      expect(stat).toBeInTheDocument()
    })
  })
})