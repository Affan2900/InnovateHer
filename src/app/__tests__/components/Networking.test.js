import { render, screen, fireEvent } from '@testing-library/react'
import Networking from '@/app/[locale]/networking/page.jsx'

// Mock dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key => key)
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
      { _id: '1', title: 'Networking Event 1', description: 'Desc 1', date: '2024-06-15', location: 'City A', price: 100, imageUrl: '', category: 'networking' },
      { _id: '2', title: 'Networking Event 2', description: 'Desc 2', date: '2024-06-16', location: 'City B', price: 200, imageUrl: '', category: 'networking' }
    ])
  })
)

describe('Networking page', () => {
  beforeEach(() => {
    fetch.mockClear()
    mockPush.mockClear()
  })

  test('renders networking heading', async () => {
    render(<Networking />)
    expect(await screen.findByText('networking')).toBeInTheDocument()
  })

  test('renders all networking events', async () => {
    render(<Networking />)
    expect(await screen.findByText('Networking Event 1')).toBeInTheDocument()
    expect(await screen.findByText('Networking Event 2')).toBeInTheDocument()
    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    expect(screen.getByText('Desc 2')).toBeInTheDocument()
    expect(screen.getByText('City A', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('City B', { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/100 PKR/)).toBeInTheDocument()
    expect(screen.getByText(/200 PKR/)).toBeInTheDocument()
  })

  test('renders add networking event button', async () => {
    render(<Networking />)
    expect(await screen.findByText('addNetworkingEvent')).toBeInTheDocument()
  })

  test('renders view details button for each event', async () => {
    render(<Networking />)
    expect(await screen.findAllByText('viewDetails')).toHaveLength(2)
  })

  
})