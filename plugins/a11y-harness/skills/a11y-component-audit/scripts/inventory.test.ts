import { describe, expect, it } from 'vitest'
import { inventoryOf } from './inventory.ts'

const WCAG = 'wcag-2.2'
const FORM_FIELD = { id: 'form-field', signals: ['<input'], criteria: { [WCAG]: ['3.3.2'] } }
const TABLE = { elements: [FORM_FIELD] }

describe('inventoryOf', () => {
  it('lists an element whose signal the source matches, with the criteria of the chosen standard', () => {
    expect(inventoryOf(TABLE, '<input type="email" />', WCAG)).toEqual([{ element: 'form-field', criteria: ['3.3.2'] }])
  })
})
