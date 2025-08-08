import { describe, it, expect, vi } from '@jest/globals'
import React from 'react'
import { render, screen } from '@testing-library/react'
import ToolPage from '../../app/tool/[slug]/page'

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'date-calculator' }),
  useRouter: () => ({ push: vi.fn() })
}))

describe('Tool Page', () => {
  it('loads and renders tool page container', async () => {
    ;(global.fetch as any) = vi.fn(async (url: string) => ({
      ok: true,
      json: async () => ({
        id: 'date-calculator',
        title: 'Date Calculator',
        description: 'Calc',
        icon: 'Calendar',
        difficulty: 'S-1',
        bugs: [],
        brokenCode: 'function x(){}',
        fixedCode: 'function y(){}'
      })
    }))

    render(React.createElement(ToolPage))
    // minimal smoke check
    expect(screen.getByText(/Date/i)).toBeTruthy()
  })
})


