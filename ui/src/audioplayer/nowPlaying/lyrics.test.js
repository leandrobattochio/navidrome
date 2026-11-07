import { describe, it, expect } from 'vitest'
import { buildWords, findActiveLine, pickLyrics, wordProgress } from './lyrics'

describe('pickLyrics', () => {
  it('prefers synced lyrics over an earlier unsynced entry', () => {
    const synced = { synced: true, line: [{ start: 0, value: 'timed' }] }
    const plain = { synced: false, line: [{ value: 'plain' }] }

    expect(pickLyrics([plain, synced])).toEqual({
      synced: true,
      lines: synced.line,
    })
  })

  it('falls back to unsynced lyrics', () => {
    const plain = { line: [{ value: 'plain' }] }

    expect(pickLyrics([plain])).toEqual({ synced: false, lines: plain.line })
  })

  it.each([[undefined], [null], [[]], [[{ synced: true, line: [] }]]])(
    'returns null for %j',
    (lyrics) => {
      expect(pickLyrics(lyrics)).toBeNull()
    },
  )
})

describe('findActiveLine', () => {
  const lines = [{ start: 1000 }, { start: 2000 }, { start: 3000 }]

  it('is -1 before the first line', () => {
    expect(findActiveLine(lines, 999)).toBe(-1)
  })

  it('starts a line exactly on its timestamp', () => {
    expect(findActiveLine(lines, 2000)).toBe(1)
  })

  it('keeps the current line between timestamps', () => {
    expect(findActiveLine(lines, 2999)).toBe(1)
  })

  it('stays on the last line after it starts', () => {
    expect(findActiveLine(lines, 99000)).toBe(2)
  })

  it('treats a missing start as the beginning of the track', () => {
    expect(findActiveLine([{}, { start: 5000 }], 0)).toBe(0)
  })

  it('handles an empty list', () => {
    expect(findActiveLine([], 1000)).toBe(-1)
  })
})

describe('buildWords', () => {
  it('keeps spaces and treats byteEnd as inclusive', () => {
    const cues = [
      { start: 100, end: 200, byteStart: 0, byteEnd: 1 },
      { start: 300, end: 400, byteStart: 3, byteEnd: 7 },
    ]

    expect(buildWords('Oi mundo', cues, 900)).toEqual([
      { text: 'Oi ', start: 100, end: 200 },
      { text: 'mundo', start: 300, end: 400 },
    ])
  })

  it('counts UTF-8 bytes, not characters', () => {
    const cues = [
      { start: 100, byteStart: 0, byteEnd: 3 },
      { start: 300, byteStart: 5, byteEnd: 9 },
    ]

    expect(buildWords('Olá você', cues, 900).map((w) => w.text)).toEqual([
      'Olá ',
      'você',
    ])
  })

  it('ends a word at the next one, then at the line end', () => {
    const cues = [
      { start: 100, byteStart: 0, byteEnd: 0 },
      { start: 300, byteStart: 2, byteEnd: 2 },
    ]

    expect(buildWords('a b', cues, 900).map((w) => w.end)).toEqual([300, 900])
  })

  it.each([
    ['past the end', [{ start: 1, byteStart: 0, byteEnd: 50 }]],
    ['reversed', [{ start: 1, byteStart: 2, byteEnd: 1 }]],
    ['without a start', [{ byteStart: 0, byteEnd: 1 }]],
    [
      'overlapping',
      [
        { start: 1, byteStart: 0, byteEnd: 2 },
        { start: 2, byteStart: 1, byteEnd: 3 },
      ],
    ],
    ['empty', []],
  ])('returns null when cues are %s', (_, cues) => {
    expect(buildWords('abcd', cues, 900)).toBeNull()
  })
})

describe('pickLyrics with word timing', () => {
  const line = [
    { start: 0, value: 'ab' },
    { start: 1000, value: 'cd' },
  ]

  it('adds words only to the lines that have cues', () => {
    const { lines } = pickLyrics([
      {
        synced: true,
        line,
        cueLine: [
          { index: 0, cue: [{ start: 0, end: 500, byteStart: 0, byteEnd: 1 }] },
        ],
      },
    ])

    expect(lines[0].words).toEqual([{ text: 'ab', start: 0, end: 500 }])
    expect(lines[1].words).toBeUndefined()
  })

  it('keeps the line when its cues do not match the text', () => {
    const { lines } = pickLyrics([
      {
        synced: true,
        line,
        cueLine: [{ index: 0, cue: [{ start: 0, byteStart: 0, byteEnd: 9 }] }],
      },
    ])

    expect(lines[0].words).toBeUndefined()
  })

  it('uses the first cue line of a line with several agents', () => {
    const { lines } = pickLyrics([
      {
        synced: true,
        line,
        cueLine: [
          { index: 0, cue: [{ start: 7, byteStart: 0, byteEnd: 1 }] },
          { index: 0, cue: [{ start: 9, byteStart: 0, byteEnd: 1 }] },
        ],
      },
    ])

    expect(lines[0].words[0].start).toBe(7)
  })

  it('ignores translations and other non-main kinds', () => {
    const main = { synced: true, kind: 'main', line }
    const translation = {
      synced: true,
      kind: 'translation',
      line: [{ value: 't' }],
    }

    expect(pickLyrics([translation, main]).lines).toEqual(line)
  })
})

describe('wordProgress', () => {
  const word = { start: 1000, end: 2000 }

  it.each([
    [999, 0],
    [1000, 0],
    [1500, 0.5],
    [2000, 1],
    [9000, 1],
  ])('at %i ms is %f', (position, expected) => {
    expect(wordProgress(word, position)).toBe(expected)
  })

  it('fills instantly when a word has no duration', () => {
    expect(wordProgress({ start: 1000, end: 1000 }, 999)).toBe(0)
    expect(wordProgress({ start: 1000, end: 1000 }, 1000)).toBe(1)
  })
})
