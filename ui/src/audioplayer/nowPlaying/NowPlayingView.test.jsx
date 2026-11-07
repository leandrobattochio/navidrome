import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import subsonic from '../../subsonic'
import { NowPlayingView } from './NowPlayingView'

vi.mock('react-admin', () => ({
  useTranslate: () => (key, options) => options?._ ?? key,
}))
vi.mock('../../subsonic', () => ({
  default: { getLyricsBySongId: vi.fn(), getCoverArtUrl: vi.fn() },
}))

const lyricsResponse = (structuredLyrics) => ({
  json: { 'subsonic-response': { lyricsList: { structuredLyrics } } },
})
const synced = [
  {
    synced: true,
    line: [
      { start: 1000, value: 'first' },
      { start: 5000, value: 'second' },
    ],
  },
]
const track = { trackId: 'a', name: 'Song', singer: 'Band' }

const renderView = async (props = {}) => {
  const onClose = vi.fn()
  await act(async () => {
    render(
      <NowPlayingView
        open
        onClose={onClose}
        audio={{ currentTime: 0 }}
        track={track}
        {...props}
      />,
    )
  })
  return onClose
}

describe('<NowPlayingView />', () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn()
    window.matchMedia = vi.fn(() => ({ matches: false }))
    subsonic.getLyricsBySongId.mockResolvedValue(lyricsResponse(synced))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('does not look for lyrics while closed', async () => {
    await renderView({ open: false })

    expect(subsonic.getLyricsBySongId).not.toHaveBeenCalled()
  })

  it('marks the line at the current position', async () => {
    await renderView({ audio: { currentTime: 6 } })

    expect(screen.getByText('second')).toHaveAttribute('aria-current', 'true')
    expect(screen.getByText('first')).not.toHaveAttribute('aria-current')
  })

  it('asks for word timing', async () => {
    await renderView()

    expect(subsonic.getLyricsBySongId).toHaveBeenCalledWith('a', {
      enhanced: true,
    })
  })

  it('fills the words of the active line up to the position', async () => {
    subsonic.getLyricsBySongId.mockResolvedValue(
      lyricsResponse([
        {
          synced: true,
          line: [{ start: 1000, value: 'ab cd' }],
          cueLine: [
            {
              index: 0,
              cue: [
                { start: 1000, end: 2000, byteStart: 0, byteEnd: 1 },
                { start: 2000, end: 3000, byteStart: 3, byteEnd: 4 },
              ],
            },
          ],
        },
      ]),
    )
    await renderView({ audio: { currentTime: 2.5 } })

    expect(
      screen.getByText('ab', { exact: false }).style.getPropertyValue('--fill'),
    ).toBe('100%')
    expect(screen.getByText('cd').style.getPropertyValue('--fill')).toBe('50%')
  })

  it('seeks when a synced line is clicked', async () => {
    const audio = { currentTime: 0 }
    await renderView({ audio })

    fireEvent.click(screen.getByText('second'))

    expect(audio.currentTime).toBe(5)
  })

  it('shows unsynced lyrics as plain text', async () => {
    subsonic.getLyricsBySongId.mockResolvedValue(
      lyricsResponse([{ synced: false, line: [{ value: 'plain' }] }]),
    )
    await renderView()

    expect(screen.getByText('plain').tagName).toBe('P')
  })

  it('says so when the track has no lyrics', async () => {
    subsonic.getLyricsBySongId.mockResolvedValue(lyricsResponse([]))
    await renderView()

    expect(screen.getByRole('status')).toHaveTextContent(
      'No lyrics for this track',
    )
  })

  it('treats a failed request as no lyrics', async () => {
    subsonic.getLyricsBySongId.mockRejectedValue(new Error('down'))
    await renderView()

    expect(screen.getByRole('status')).toHaveTextContent(
      'No lyrics for this track',
    )
  })

  it('does not look for lyrics on a radio', async () => {
    await renderView({ track: { ...track, isRadio: true } })

    expect(subsonic.getLyricsBySongId).not.toHaveBeenCalled()
  })

  it('closes on Escape and on navigation', async () => {
    const onClose = await renderView()

    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent(window, new HashChangeEvent('hashchange'))

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
