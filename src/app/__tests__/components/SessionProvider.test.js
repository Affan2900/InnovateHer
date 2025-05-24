import { render, screen } from '@testing-library/react'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'

// Mock next-auth's SessionProvider
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }) => <div data-testid="session-provider">{children}</div>
}))

describe('SessionProviderWrapper', () => {
  test('renders children inside SessionProvider', () => {
    render(
      <SessionProviderWrapper>
        <div>Test Child</div>
      </SessionProviderWrapper>
    )
    expect(screen.getByTestId('session-provider')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })
})