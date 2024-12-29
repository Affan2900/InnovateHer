import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: '',
    }
  },
  usePathname() {
    return ''
  },
}))