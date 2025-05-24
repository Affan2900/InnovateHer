import { render, screen } from '@testing-library/react'
import SkillBuilding from '@/app/[locale]/skill-building/page.jsx'

// Mock dependencies
jest.mock('next-intl', () => ({
  useTranslations: () => (key => key)
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
      { _id: '1', title: 'Course 1', description: 'Desc 1', duration: '2 weeks', difficulty: 'Beginner', imageUrl: '', category: 'skill-building' },
      { _id: '2', title: 'Course 2', description: 'Desc 2', duration: '1 month', difficulty: 'Intermediate', imageUrl: '', category: 'skill-building' }
    ])
  })
)

describe('SkillBuilding page', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test('renders skill building heading', async () => {
    render(<SkillBuilding />)
    expect(await screen.findByText('skillBuilding')).toBeInTheDocument()
  })

  test('renders all skill-building courses', async () => {
    render(<SkillBuilding />)
    expect(await screen.findByText('Course 1')).toBeInTheDocument()
    expect(await screen.findByText('Course 2')).toBeInTheDocument()
    expect(screen.getByText('Desc 1')).toBeInTheDocument()
    expect(screen.getByText('Desc 2')).toBeInTheDocument()
    expect(screen.getByText('2 weeks')).toBeInTheDocument()
    expect(screen.getByText('1 month')).toBeInTheDocument()
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
  })

  test('renders add skill building course button', async () => {
    render(<SkillBuilding />)
    expect(await screen.findByText('addSkillBuildingCourse')).toBeInTheDocument()
  })

  test('renders enroll now button for each course', async () => {
    render(<SkillBuilding />)
    expect(await screen.findAllByText('enrollNow')).toHaveLength(2)
  })

  
})