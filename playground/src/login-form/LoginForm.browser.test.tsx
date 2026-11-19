import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { textWithoutEnoughContrast } from '../testing/contrast'
import { elementsWithoutVisibleFocus } from '../testing/focus-indicator'
import { LoginForm } from './LoginForm'

const SUBMIT_BUTTON_NAME = /se connecter/i

describe('LoginForm in a browser', () => {
  it('WCAG 2.4.7, RGAA 10.7: shows the keyboard focus on every element it reaches', async () => {
    const screen = await render(<LoginForm />)

    expect(await elementsWithoutVisibleFocus(screen.container)).toEqual([])
  })

  it('WCAG 1.4.3, RGAA 3.2: gives its text enough contrast, before and after a submission with errors', async () => {
    const screen = await render(<LoginForm />)
    const beforeSubmission = await textWithoutEnoughContrast(screen.container)
    await userEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_NAME }))

    expect([...beforeSubmission, ...(await textWithoutEnoughContrast(screen.container))]).toEqual([])
  })
})
