import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { undersizedTargets } from '../testing/target-size'
import { LoginForm } from './LoginForm'

describe('LoginForm in a browser, WCAG 2.2 only', () => {
  it('WCAG 2.5.8: gives every target a size of at least 24 by 24 CSS pixels, or the spacing that stands for it', async () => {
    const screen = await render(<LoginForm />)

    expect(undersizedTargets(screen.container)).toEqual([])
  })
})
