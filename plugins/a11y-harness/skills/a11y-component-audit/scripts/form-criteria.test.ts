import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { inventoryOf } from './inventory.ts'

const TABLE_FILE = join(import.meta.dirname, '../reference/form-criteria.json')
const TEXT_ENCODING = 'utf8'
const WCAG = 'wcag-2.2'

const table = JSON.parse(readFileSync(TABLE_FILE, TEXT_ENCODING))
const elementsIn = (source: string) => inventoryOf(table, source, WCAG).map(({ element }) => element)

const FORM_FIELDS = [
  '<input id={emailFieldId} type="email" name="email" />',
  "<input\n  id={passwordFieldId}\n  type={isPasswordVisible ? 'text' : 'password'}\n/>",
  '<input type="checkbox" />',
  '<textarea name="message" />',
  '<select name="country">',
  '<div role="combobox" aria-expanded="false">',
]

const NOT_FORM_FIELDS = [
  '<input type="submit" value="Envoyer" />',
  '<input type="reset" />',
  '<input type="button" value="Ajouter" />',
  '<input type="image" src="ok.png" alt="Valider" />',
  '<input type="hidden" name="token" />',
]

describe('form criteria table', () => {
  it.each(FORM_FIELDS)('finds a form field in %s', (source) => {
    expect(elementsIn(source)).toContain('form-field')
  })

  it.each(NOT_FORM_FIELDS)('finds no form field in %s, which the RGAA glossary leaves out of form fields', (source) => {
    expect(elementsIn(source)).not.toContain('form-field')
  })
})
