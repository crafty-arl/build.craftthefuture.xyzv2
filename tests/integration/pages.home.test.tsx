import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BuildPlatform from '../../app/page'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))

describe('Home Page', () => {
  beforeEach(() => {
    ;(global.fetch as any) = vi.fn(async (url: string) => ({ ok: true, json: async () => ({}) }))
  })

  it('renders without crashing and shows container', () => {
    render(React.createElement(BuildPlatform))
    expect(screen.getByText(/Build/i)).toBeTruthy()
  })
})


