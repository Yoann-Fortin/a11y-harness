import { describe, expect, it } from 'vitest'
import { inventoryOf } from './inventory.ts'

const WCAG = 'wcag-2.2'
const FORM_FIELD = { id: 'form-field', signals: ['<input', '<textarea'], criteria: { [WCAG]: ['3.3.2'] } }
const SUBMIT_BUTTON = { id: 'submit-button', signals: ['<button'], criteria: { [WCAG]: ['4.1.2'] } }
const PASSWORD_FIELD = { id: 'password-field', signals: ['<input[^>]*type="password"'], criteria: { [WCAG]: ['3.3.8'] } }
const TABLE = { elements: [FORM_FIELD, SUBMIT_BUTTON] }

describe('inventoryOf', () => {
  it('lists an element whose signal the source matches, with the criteria of the chosen standard', () => {
    expect(inventoryOf(TABLE, '<input type="email" />', WCAG)).toEqual([{ element: 'form-field', criteria: ['3.3.2'] }])
  })

  it('leaves out an element whose signals the source does not match', () => {
    expect(inventoryOf(TABLE, '<button>Se connecter</button>', WCAG)).toEqual([{ element: 'submit-button', criteria: ['4.1.2'] }])
  })

  it('finds an element through any of its signals', () => {
    expect(inventoryOf(TABLE, '<textarea />', WCAG)).toEqual([{ element: 'form-field', criteria: ['3.3.2'] }])
  })

  it('reads each signal as a regular expression', () => {
    const source = '<input name="secret" type="password" />'

    expect(inventoryOf({ elements: [PASSWORD_FIELD] }, source, WCAG)).toEqual([{ element: 'password-field', criteria: ['3.3.8'] }])
  })
})
