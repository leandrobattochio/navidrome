import { describe, it, expect } from 'vitest'
import { lyricsToLrc } from './lyrics'

describe('lyricsToLrc', () => {
  it('formats synced lines as LRC', () => {
    const lyrics = [
      {
        synced: true,
        line: [
          { start: 1500, value: 'first' },
          { start: 61230, value: 'second' },
        ],
      },
    ]

    expect(lyricsToLrc(lyrics, 120)).toBe('[00:01.50] first\n[01:01.23] second')
  })

  it('does not wrap minutes after one hour', () => {
    const lyrics = [{ synced: true, line: [{ start: 3661000, value: 'late' }] }]

    expect(lyricsToLrc(lyrics, 4000)).toBe('[61:01.00] late')
  })

  it('treats a missing start as the beginning of the track', () => {
    const lyrics = [{ synced: true, line: [{ value: 'no start' }] }]

    expect(lyricsToLrc(lyrics, 10)).toBe('[00:00.00] no start')
  })

  it('prefers synced lyrics over an earlier unsynced entry', () => {
    const lyrics = [
      { synced: false, line: [{ value: 'plain' }] },
      { synced: true, line: [{ start: 0, value: 'timed' }] },
    ]

    expect(lyricsToLrc(lyrics, 10)).toBe('[00:00.00] timed')
  })

  it('spreads unsynced lines evenly across the track', () => {
    const lyrics = [
      { synced: false, line: [{ value: 'a' }, { value: 'b' }, { value: 'c' }] },
    ]

    expect(lyricsToLrc(lyrics, 30)).toBe(
      '[00:00.00] a\n[00:10.00] b\n[00:20.00] c',
    )
  })

  it('returns nothing for unsynced lyrics without a known duration', () => {
    const lyrics = [{ synced: false, line: [{ value: 'a' }] }]

    expect(lyricsToLrc(lyrics, 0)).toBe('')
  })

  it.each([[undefined], [null], [[]], [[{ synced: true, line: [] }]]])(
    'returns nothing for %j',
    (lyrics) => {
      expect(lyricsToLrc(lyrics, 10)).toBe('')
    },
  )
})
