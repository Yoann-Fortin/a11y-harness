import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { elementsWithoutVisibleFocus } from '../testing/focus-indicator'
import { LoginForm } from './LoginForm'

describe('LoginForm in a browser', () => {
  it('WCAG 2.4.7, RGAA 10.7: shows the keyboard focus on every element it reaches', async () => {
    const screen = await render(<LoginForm />)

    expect(await elementsWithoutVisibleFocus(screen.container)).toEqual([])
  })
})
