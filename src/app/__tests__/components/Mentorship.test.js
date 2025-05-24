import { render, screen } from '@testing-library/react'
import Mentorship from '@/app/[locale]/mentorship/page.jsx'

// Mock dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key => key)
}))
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: '123', name: 'Test User' } } })
}))
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))
jest.mock('@/components/FixedNavbar', () => () => <div data-testid="fixed-navbar" />)
jest.mock('@/components/LanguageToggle', () => () => <div data-testid="language-toggle" />)
jest.mock('@/components/Footer', () => () => <div data-testid="footer" />)
jest.mock('@/lib/store/useLocaleStore', () => ({
  __esModule: true,
  default: () => ({ currentLocale: 'en' })
}))
jest.mock('next/image', () => (props) => <img {...props} />)
jest.mock('next/link', () => ({ children, href }) => <a href={href}>{children}</a>)

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { _id: '1', title: 'Mentor 1', expertise: 'React', description: 'Desc', imageUrl: '', category: 'mentorship' }
    ])
  })
)

describe('Mentorship page', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('renders mentorship heading', async () => {
    render(<Mentorship />)
    expect(await screen.findByText('mentorship')).toBeInTheDocument()
  })

  test('renders mentor card with title', async () => {
    render(<Mentorship />)
    expect(await screen.findByText('Mentor 1')).toBeInTheDocument()
  })

  test('renders mentor expertise and description', async () => {
    render(<Mentorship />)
    expect(await screen.findByText('React')).toBeInTheDocument()
    expect(await screen.findByText('Desc')).toBeInTheDocument()
  })

  test('renders add mentorship opportunity button', async () => {
    render(<Mentorship />)
    expect(await screen.findByText('addMentorshipOpportunity')).toBeInTheDocument()
  })

  test('renders request mentorship button', async () => {
    render(<Mentorship />)
    expect(await screen.findByText('requestMentorship')).toBeInTheDocument()
  })

  
})