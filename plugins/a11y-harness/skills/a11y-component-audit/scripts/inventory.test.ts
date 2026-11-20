import { describe, expect, it } from 'vitest'
import { type CriteriaTableFile, criteriaOf, criteriaTableFrom, holdsForm, inventoryOf } from './inventory.ts'

const WCAG = 'wcag-2.2'
const FORM_FIELD: CriteriaTableFile['elements'][number] = { id: 'form-field', signals: ['<input', '<textarea'], criteria: { [WCAG]: ['3.3.2'] } }
const SUBMIT_BUTTON: CriteriaTableFile['elements'][number] = { id: 'submit-button', signals: ['<button'], criteria: { [WCAG]: ['4.1.2'] } }
const PASSWORD_FIELD: CriteriaTableFile['elements'][number] = { id: 'password-field', signals: ['<input[^>]*type="password"'], criteria: { [WCAG]: ['3.3.8'] } }
const FORM = { signals: ['<form', 'role="form"'] }
const TABLE = criteriaTableFrom({ form: FORM, elements: [FORM_FIELD, SUBMIT_BUTTON] })

describe('inventoryOf', () => {
  it('lists an element whose signal the source matches, with the criteria of the chosen standard', () => {
    expect(inventoryOf(TABLE, ['<form><input type="email" /></form>'], WCAG)).toEqual([{ element: 'form-field', criteria: ['3.3.2'] }])
  })

  it('leaves out an element whose signals the source does not match', () => {
    expect(inventoryOf(TABLE, ['<form><button>Se connecter</button></form>'], WCAG)).toEqual([{ element: 'submit-button', criteria: ['4.1.2'] }])
  })

  it('finds an element through any of its signals', () => {
    expect(inventoryOf(TABLE, ['<form><textarea /></form>'], WCAG)).toEqual([{ element: 'form-field', criteria: ['3.3.2'] }])
  })

  it('reads each signal as a regular expression', () => {
    const source = '<form><input name="secret" type="password" /></form>'

    expect(inventoryOf(criteriaTableFrom({ form: FORM, elements: [PASSWORD_FIELD] }), [source], WCAG)).toEqual([{ element: 'password-field', criteria: ['3.3.8'] }])
  })

  it('lists nothing in a source that holds no form', () => {
    expect(inventoryOf(TABLE, ['<input type="email" />'], WCAG)).toEqual([])
  })

  it('lists the elements of the components rendered inside the form', () => {
    const sources = ['<form onSubmit={signIn}><PasswordToggle /></form>', '<button type="button">']

    expect(inventoryOf(TABLE, sources, WCAG)).toEqual([{ element: 'submit-button', criteria: ['4.1.2'] }])
  })
})

describe('holdsForm', () => {
  it.each(['<form onSubmit={handleSubmit}>', '<div role="form">'])('finds a form in %s', (source) => {
    expect(holdsForm(TABLE, source)).toBe(true)
  })

  it.each(['<fieldset>', '<div role="group">'])('finds no form in %s', (source) => {
    expect(holdsForm(TABLE, source)).toBe(false)
  })
})

describe('criteriaTableFrom', () => {
  it('compiles every signal of the table file once, and keeps the ids and criteria of its elements', () => {
    const file = {
      form: { signals: ['<form', 'role="form"'] },
      elements: [{ id: 'form-field', signals: ['<input', '<textarea'], criteria: { [WCAG]: ['3.3.2' as const] } }],
    }

    expect(criteriaTableFrom(file)).toEqual({
      form: { signals: [/<form/, /role="form"/] },
      elements: [{ id: 'form-field', signals: [/<input/, /<textarea/], criteria: { [WCAG]: ['3.3.2'] } }],
    })
  })
})

describe('criteriaOf', () => {
  it('lists once each criterion that the elements of the table open for the chosen standard', () => {
    const file: CriteriaTableFile = {
      form: FORM,
      elements: [
        { id: 'form-field', signals: ['<input'], criteria: { [WCAG]: ['3.3.2', '4.1.2'], 'rgaa-4.1.2': ['11.1'] } },
        { id: 'submit-button', signals: ['<button'], criteria: { [WCAG]: ['4.1.2'] } },
        { id: 'required-field', signals: ['required'], criteria: { 'rgaa-4.1.2': ['11.10'] } },
      ],
    }

    expect(criteriaOf(file, WCAG)).toEqual(['3.3.2', '4.1.2'])
  })
})
