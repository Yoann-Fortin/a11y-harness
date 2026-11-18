import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { findRgaaCriteria, findWcagCriteria } from './find-criterion.ts'
import { holdsForm, inventoryOf } from './inventory.ts'

const TABLE_FILE = join(import.meta.dirname, '../reference/form-criteria.json')
const STANDARDS_DIR = join(import.meta.dirname, '../reference/standards')
const WCAG_FILE = 'wcag-2.2.json'
const RGAA_FILE = 'rgaa-4.1.2-criteres.json'
const RGAA = 'rgaa-4.1.2'
const TEXT_ENCODING = 'utf8'
const WCAG = 'wcag-2.2'

const readJson = (path: string) => JSON.parse(readFileSync(path, TEXT_ENCODING))
const table = readJson(TABLE_FILE)
const wcag = readJson(join(STANDARDS_DIR, WCAG_FILE))
const rgaa = readJson(join(STANDARDS_DIR, RGAA_FILE))
const criteriaOf = (standard: string): string[] =>
  table.elements.flatMap(({ criteria }: { criteria: Record<string, string[]> }) => criteria[standard])
const elementsIn = (source: string) => inventoryOf(table, source, WCAG).map(({ element }) => element)

const FORMS = ['<form onSubmit={handleSubmit}>', '<form noValidate onSubmit={handleSubmit}>', '<section role="form" aria-label="Contact">', "<div role='form'>"]

const FORM_FIELDS = [
  '<input id={emailFieldId} type="email" name="email" />',
  "<input\n  id={passwordFieldId}\n  type={isPasswordVisible ? 'text' : 'password'}\n/>",
  '<input type="checkbox" />',
  '<textarea name="message" />',
  '<select name="country">',
  '<div role="combobox" aria-expanded="false">',
  '<datalist id="countries">',
  '<output name="total">',
  '<progress value={70} max={100} />',
  '<meter value={0.6} />',
  ...['textbox', 'searchbox', 'listbox', 'checkbox', 'radio', 'switch', 'slider', 'spinbutton', 'progressbar'].map(
    (role) => `<div role="${role}">`,
  ),
]

const NOT_FORM_FIELDS = [
  '<input type="submit" value="Envoyer" />',
  '<input type="reset" />',
  '<input type="button" value="Ajouter" />',
  '<input type="image" src="ok.png" alt="Valider" />',
  '<input type="hidden" name="token" />',
]

const PASSWORD_FIELDS = [
  '<input type="password" />',
  "type={isPasswordVisible ? 'text' : 'password'}",
]

const REQUIRED_FIELDS = [
  '<input required />',
  '<input aria-required="true" />',
  '<label htmlFor={id}>Nom (obligatoire)</label>',
  "const EMAIL_REQUIRED_ERROR = 'Saisissez votre adresse e-mail'",
  "if (field.value === '') {",
]

const USER_INFORMATION_FIELDS = [
  '<input autoComplete="email" />',
  '<input type="email" />',
  '<input type="tel" />',
  '<input name="username" />',
]

const SCRIPT_BUTTONS = [
  '<button type="button" onClick={onToggle}>',
  '<div role="button" tabIndex={0}>',
  '<button aria-pressed={isPasswordVisible}>',
  '<input type="button" value="Ajouter" />',
]

const SUBMIT_BUTTONS = [
  '<button type="submit">{SUBMIT_LABEL}</button>',
  '<button>Se connecter</button>',
  '<input type="submit" value="Envoyer" />',
  '<input type="reset" />',
]

const BUTTONS_THAT_DO_NOT_SUBMIT = ['<button type="button" onClick={onToggle}>', "<button\n  type='button'\n  aria-pressed={isPasswordVisible}\n>"]

const FIELD_ERRORS = [
  '<input aria-invalid={hasError} />',
  '<input aria-errormessage={errorId} />',
  "const EMAIL_FORMAT_ERROR = 'Saisissez une adresse e-mail valide'",
  'setErrors({ email: undefined })',
  '<input type="email" />',
  '<input pattern="[0-9]{5}" />',
]

const STATUS_MESSAGES = [
  '<p role="alert">',
  '<div role="status">',
  '<div role="log">',
  '<div aria-live="polite">',
]

describe('form criteria table', () => {
  it.each(FORMS)('finds a form, as the RGAA glossary defines it, in %s', (source) => {
    expect(holdsForm(table, source)).toBe(true)
  })

  it.each(FORM_FIELDS)('finds a form field in %s', (source) => {
    expect(elementsIn(source)).toContain('form-field')
  })

  it.each(NOT_FORM_FIELDS)('finds no form field in %s, which the RGAA glossary leaves out of form fields', (source) => {
    expect(elementsIn(source)).not.toContain('form-field')
  })

  it.each(PASSWORD_FIELDS)('finds a password field in %s', (source) => {
    expect(elementsIn(source)).toContain('password-field')
  })

  it.each(REQUIRED_FIELDS)('finds a required field in %s', (source) => {
    expect(elementsIn(source)).toContain('required-field')
  })

  it.each(USER_INFORMATION_FIELDS)('finds a field about the user in %s', (source) => {
    expect(elementsIn(source)).toContain('user-information')
  })

  it.each(SCRIPT_BUTTONS)('finds a button driven by a script in %s', (source) => {
    expect(elementsIn(source)).toContain('script-button')
  })

  it.each(SUBMIT_BUTTONS)('finds a button that submits or resets a form in %s', (source) => {
    expect(elementsIn(source)).toContain('submit-button')
  })

  it.each(BUTTONS_THAT_DO_NOT_SUBMIT)('finds no button that submits a form in %s', (source) => {
    expect(elementsIn(source)).not.toContain('submit-button')
  })

  it.each(FIELD_ERRORS)('finds an error message or a native validation in %s', (source) => {
    expect(elementsIn(source)).toContain('field-error')
  })

  it.each(STATUS_MESSAGES)('finds a status message in %s', (source) => {
    expect(elementsIn(source)).toContain('status-message')
  })

  it.each(criteriaOf(WCAG))('opens WCAG 2.2 success criterion %s, which the official texts define', (id) => {
    expect(findWcagCriteria(wcag, id)).not.toEqual([])
  })

  it.each(criteriaOf(RGAA))('opens RGAA 4.1.2 criterion %s, which the official texts define', (id) => {
    expect(findRgaaCriteria(rgaa, id)).not.toEqual([])
  })
})
