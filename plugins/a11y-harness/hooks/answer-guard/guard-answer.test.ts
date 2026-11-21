import { describe, expect, it } from 'vitest'
import type { CriterionId, Standard } from '../../skills/a11y-component-audit/scripts/standard.ts'
import { type AnswerCheck, guardAnswer } from './guard-answer.ts'
import { transcriptOf } from './transcript.ts'

const INVENTORY = 'node "/plugins/a11y-harness/skills/a11y-component-audit/scripts/main.ts" inventory rgaa-4.1.2 src/Form.tsx'
const TOGGLE_INVENTORY = '[{"element":"script-button","criteria":["7.1","7.3"]}]'
const TABLE_CRITERIA: Record<Standard, CriterionId[]> = { 'rgaa-4.1.2': ['7.1', '7.3', '11.9'], 'wcag-2.2': ['4.1.2'] }

const toolUse = (id: string, command: string) =>
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name: 'Bash', input: { command } }] } })
const toolResult = (id: string, content: string) =>
  JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content }] } })
const AUDITED_TOGGLE = [toolUse('toolu_1', INVENTORY), toolResult('toolu_1', TOGGLE_INVENTORY)]
const FORM_SIGNALS = [/role="form"/, /<form/]
const readUse = (id: string, filePath: string) =>
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name: 'Read', input: { file_path: filePath } }] } })
const toolCall = (id: string, name: string, input: Record<string, string>) =>
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name, input }] } })
const WROTE_TESTS = [
  toolCall('toolu_4', 'Skill', { skill: 'a11y-harness:a11y-test-writer' }),
  toolCall('toolu_5', 'Write', { file_path: '/project/src/Filter.wcag.test.tsx', content: 'it()' }),
]
const READ_FORM = [readUse('toolu_2', 'src/Form.tsx'), toolResult('toolu_2', '1\t<form onSubmit={submit}>')]

const guard = (check: Omit<AnswerCheck, 'transcript'> & { transcript: string[] }) =>
  guardAnswer({ ...check, transcript: transcriptOf(check.transcript) })

describe('guardAnswer', () => {
  it('sends back an answer that cites a criterion of the table that the inventory did not open', () => {
    const answer = 'The toggle fails 7.1, and many auditors would also fail 11.9.'

    expect(
      guard({ answer, transcript: AUDITED_TOGGLE, tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false }),
    ).toMatchObject({ decision: 'block', reason: expect.stringContaining('11.9') })
  })

  it('lets an answer through when the inventory opened every criterion it cites', () => {
    const answer = 'The toggle fails 7.1, test 7.1.1.'

    expect(guard({ answer, transcript: AUDITED_TOGGLE, tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false })).toBeNull()
  })

  it('lets the answer through when Claude is already answering a first block', () => {
    const answer = 'Many auditors would also fail 11.9.'

    expect(guard({ answer, transcript: AUDITED_TOGGLE, tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: true })).toBeNull()
  })

  it('lets through the answer of a session that ran no inventory', () => {
    const answer = 'Criterion 11.9 of the RGAA covers the buttons of a form.'

    expect(guard({ answer, transcript: [], tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false })).toBeNull()
  })

  it('tells Claude why the answer is sent back and what to do', () => {
    const answer = 'Many auditors would also fail 11.9.'
    const decision = guard({ answer, transcript: AUDITED_TOGGLE, tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false })

    expect(decision?.reason).toMatch(/inventory[\s\S]*11\.9[\s\S]*remove/i)
  })

  it('sends back an answer that rules on a form it read without any audit inventory, towards the skill or the agent', () => {
    const answer = 'The submit button of the form fails 11.9.'
    const decision = guard({
      answer,
      transcript: READ_FORM,
      tableCriteria: TABLE_CRITERIA,
      formSignals: FORM_SIGNALS,
      stopHookActive: false,
    })

    expect(decision).toMatchObject({
      decision: 'block',
      reason: expect.stringMatching(/a11y-component-audit[\s\S]*a11y-reviewer/),
    })
  })

  it('lets through an answer on a form that Claude read and an audit inventoried', () => {
    const answer = 'The toggle of the form fails 7.1, test 7.1.1.'

    expect(
      guard({ answer, transcript: [...READ_FORM, ...AUDITED_TOGGLE], tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false }),
    ).toBeNull()
  })

  it('only counts the files Claude read, not a form printed by another tool', () => {
    const answer = 'The submit button of the form fails 11.9.'
    const printedForm = [toolUse('toolu_3', 'grep -r form src'), toolResult('toolu_3', 'src/Form.tsx: <form onSubmit={submit}>')]

    expect(
      guard({ answer, transcript: printedForm, tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false }),
    ).toBeNull()
  })

  it('sends back the answer of a session that wrote accessibility tests without checking them with verify-tests', () => {
    const decision = guard({
      answer: 'I wrote the tests of the filter.',
      transcript: WROTE_TESTS,
      tableCriteria: TABLE_CRITERIA,
      formSignals: FORM_SIGNALS,
      stopHookActive: false,
    })

    expect(decision).toMatchObject({ decision: 'block', reason: expect.stringMatching(/without being checked[\s\S]*Filter\.wcag\.test\.tsx[\s\S]*Run verify-tests/) })
  })

  it('lets through the tests written without the test-writing skill, and the ones verify-tests checked', () => {
    const check = { answer: 'Done.', tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false }
    const withoutSkill = WROTE_TESTS.slice(1)
    const checked = [
      ...WROTE_TESTS,
      toolUse('toolu_6', 'node "/plugins/a11y-harness/skills/a11y-test-writer/scripts/main.ts" verify-tests src/Filter.wcag.test.tsx src/Filter.tsx'),
    ]

    expect([guard({ ...check, transcript: withoutSkill }), guard({ ...check, transcript: checked })]).toEqual([null, null])
  })

  it('only counts the test files written in a session of the test-writing skill and never named in a verify-tests command', () => {
    const check = { answer: 'Done.', tableCriteria: TABLE_CRITERIA, formSignals: FORM_SIGNALS, stopHookActive: false }
    const otherSkill = [toolCall('toolu_7', 'Skill', { skill: 'a11y-harness:a11y-component-audit' }), WROTE_TESTS[1]]
    const notTests = [
      WROTE_TESTS[0],
      toolCall('toolu_8', 'Read', { file_path: '/project/src/Filter.test.tsx' }),
      toolCall('toolu_9', 'Write', { file_path: '/project/src/Filter.test.tsx.bak' }),
      toolResult('toolu_9', 'File created'),
    ]
    const onlyNamed = [...WROTE_TESTS, toolUse('toolu_10', 'cat src/Filter.wcag.test.tsx')]
    const plainTestFile = [WROTE_TESTS[0], toolCall('toolu_11', 'Write', { file_path: '/project/src/Filter.test.ts' })]

    expect(
      [otherSkill, notTests, onlyNamed, plainTestFile].map((transcript) => guard({ ...check, transcript })?.decision ?? null),
    ).toEqual([null, null, 'block', 'block'])
  })
})
