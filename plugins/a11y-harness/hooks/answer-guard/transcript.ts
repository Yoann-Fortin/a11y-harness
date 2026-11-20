export type TranscriptBlock = {
  type: string
  id?: string
  name?: string
  tool_use_id?: string
  input?: { command?: string; file_path?: string; skill?: string }
  content?: string
}

export type Transcript = TranscriptBlock[]

type Entry = { message?: { content?: TranscriptBlock[] | string } }
type MessageEntry = { message: { content: TranscriptBlock[] } }

const blocksOf = (lines: string[]) =>
  lines
    .map((line): Entry => JSON.parse(line))
    .filter((entry): entry is MessageEntry => Array.isArray(entry.message?.content))
    .flatMap((entry) => entry.message.content)

export const transcriptOf = (lines: string[]): Transcript => {
  try {
    return blocksOf(lines)
  } catch {
    return []
  }
}
