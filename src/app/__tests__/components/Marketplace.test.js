import { render, screen, fireEvent } from '@testing-library/react'
import Marketplace from '@/app/[locale]/marketplace/page.jsx'

// Mock dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key => key)
}))
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { id: '123', name: 'Test User' } } })
}))
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
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
      { _id: '1', title: 'Service 1', description: 'Desc 1', price: 100, imageUrl: '', category: 'marketplace' },
      { _id: '2', title: 'Service 2', description: 'Desc 2', price: 200, imageUrl: '', category: 'marketplace' }
    ])
  })
)

describe('Marketplace page', () => {
  beforeEach(() => {
    fetch.mockClear()
    mockPush.mockClear()
  })

  test('renders marketplace heading', async () => {
    render(<Marketplace />)
    expect(await screen.findByText('marketplace')).toBeInTheDocument()
  })

  test('renders all marketplace services', async () => {
    render(<Marketplace />)
    expect(await screen.findByText('Service 1')).toBeInTheDocument()
    expect(await screen.findByText('Service 2')).toBeInTheDocument()
    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    expect(screen.getByText('Desc 2')).toBeInTheDocument()
    expect(screen.getByText('100 PKR')).toBeInTheDocument()
    expect(screen.getByText('200 PKR')).toBeInTheDocument()
  })

  test('renders add marketplace item button', async () => {
    render(<Marketplace />)
    expect(await screen.findByText('addMarketplaceItem')).toBeInTheDocument()
  })

  test('renders buy now button for each service', async () => {
    render(<Marketplace />)
    expect(await screen.findAllByText('buyNow')).toHaveLength(2)
  })



  
})