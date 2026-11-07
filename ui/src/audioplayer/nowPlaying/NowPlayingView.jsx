import React, { useEffect, useRef, useState } from 'react'
import { useTranslate } from 'react-admin'
import { fade, makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import subsonic from '../../subsonic'
import { findActiveLine, pickLyrics, wordProgress } from './lyrics'

const MANUAL_SCROLL_HOLD_MS = 4000
const COVER_SIZE = 900

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: 'fixed',
      inset: '48px 0 64px 0',
      zIndex: 999,
      display: 'grid',
      gridTemplateColumns: 'minmax(0, min(38vw, 62vh)) minmax(0, 1fr)',
      gap: 'clamp(2rem, 5vw, 6rem)',
      padding: 'clamp(1.5rem, 4vw, 4rem)',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateRows: 'auto minmax(0, 1fr)',
        gap: '1rem',
        padding: '1rem',
      },
      // Matches the breakpoint where the library switches to its full-screen player.
      '@media screen and (max-width:810px)': {
        inset: 0,
        zIndex: 1001,
      },
    },
    glow: {
      position: 'absolute',
      inset: '-15%',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      filter: 'blur(90px) saturate(1.4) brightness(0.45)',
      opacity: 0.5,
      pointerEvents: 'none',
    },
    close: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 1,
    },
    track: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minWidth: 0,
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
        paddingRight: '2.5rem',
      },
    },
    cover: {
      display: 'block',
      width: '100%',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: 8,
      boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
      [theme.breakpoints.down('sm')]: {
        width: 64,
        height: 64,
        borderRadius: 4,
        boxShadow: 'none',
      },
    },
    title: {
      margin: '1.5rem 0 0.25rem',
      fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      [theme.breakpoints.down('sm')]: { margin: 0, fontSize: '1rem' },
    },
    artist: {
      margin: 0,
      color: theme.palette.text.secondary,
      fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
    },
    lyrics: {
      position: 'relative',
      minHeight: 0,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      paddingBlock: '40vh',
      maskImage:
        'linear-gradient(transparent, #000 18%, #000 82%, transparent)',
      WebkitMaskImage:
        'linear-gradient(transparent, #000 18%, #000 82%, transparent)',
      '&::-webkit-scrollbar': { display: 'none' },
    },
    line: {
      display: 'block',
      width: '100%',
      padding: '0.4em 0',
      border: 0,
      background: 'none',
      color: theme.palette.text.primary,
      font: 'inherit',
      fontSize: 'clamp(1.35rem, 2.5vw, 2.25rem)',
      fontWeight: 700,
      lineHeight: 1.25,
      textAlign: 'left',
      opacity: 0.32,
      transition: 'opacity 240ms ease-out',
      '&:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
      },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },
    seekable: {
      cursor: 'pointer',
      '&:hover': { opacity: 0.72 },
    },
    active: {
      opacity: 1,
      '&:hover': { opacity: 1 },
      '& $word': {
        color: 'transparent',
        backgroundImage: `linear-gradient(90deg, ${theme.palette.text.primary} var(--fill, 0%), ${fade(theme.palette.text.primary, 0.35)} var(--fill, 0%))`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      },
    },
    word: {},
    plain: { opacity: 0.88 },
    status: {
      position: 'relative',
      alignSelf: 'center',
      margin: 0,
      color: theme.palette.text.secondary,
      fontSize: '1.25rem',
    },
  }),
  { name: 'NDNowPlaying' },
)

const useTrackLyrics = (trackId, enabled) => {
  const [state, setState] = useState({ trackId: null, lyrics: null })

  useEffect(() => {
    if (!enabled || !trackId) {
      return undefined
    }
    let stale = false
    subsonic
      .getLyricsBySongId(trackId, { enhanced: true })
      .then(({ json }) => {
        const list = json?.['subsonic-response']?.lyricsList?.structuredLyrics
        if (!stale) {
          setState({ trackId, lyrics: pickLyrics(list) })
        }
      })
      .catch(() => {
        if (!stale) {
          setState({ trackId, lyrics: null })
        }
      })
    return () => {
      stale = true
    }
  }, [trackId, enabled])

  return {
    loading: enabled && !!trackId && state.trackId !== trackId,
    lyrics: state.trackId === trackId ? state.lyrics : null,
  }
}

const useActiveLine = (audio, lines, enabled) => {
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (!enabled || !audio || !lines) {
      setActive(-1)
      return undefined
    }
    let frame
    const tick = () => {
      setActive(findActiveLine(lines, audio.currentTime * 1000))
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [audio, lines, enabled])

  return active
}

const useWordFill = (containerRef, audio, lines, active) => {
  const words = lines?.[active]?.words

  useEffect(() => {
    const spans = containerRef.current?.children[active]?.children
    if (!audio || !words || !spans) {
      return undefined
    }
    let frame
    const tick = () => {
      const position = audio.currentTime * 1000
      words.forEach((word, index) => {
        const fill = Math.round(wordProgress(word, position) * 1000) / 10
        spans[index]?.style.setProperty('--fill', `${fill}%`)
      })
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [containerRef, audio, words, active])
}

export const NowPlayingView = ({ open, onClose, audio, track }) => {
  const classes = useStyles()
  const translate = useTranslate()
  const isRadio = !!track?.isRadio
  const trackId = isRadio ? null : track?.trackId
  const { loading, lyrics } = useTrackLyrics(trackId, open)
  const synced = !!lyrics?.synced
  const active = useActiveLine(audio, synced ? lyrics.lines : null, open)
  const containerRef = useRef(null)
  const manualScrollUntil = useRef(0)
  useWordFill(containerRef, audio, synced ? lyrics.lines : null, active)

  useEffect(() => {
    if (!open) {
      return undefined
    }
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('hashchange', onClose)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('hashchange', onClose)
    }
  }, [open, onClose])

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 })
  }, [trackId])

  useEffect(() => {
    const container = containerRef.current
    const line = container?.children[active]
    if (!line || Date.now() < manualScrollUntil.current) {
      return
    }
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    container.scrollTo({
      top: line.offsetTop - container.clientHeight / 2 + line.offsetHeight / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [active])

  if (!open || !track) {
    return null
  }

  const cover = track.song?.album
    ? subsonic.getCoverArtUrl(track.song, COVER_SIZE)
    : track.cover

  const holdAutoScroll = () => {
    manualScrollUntil.current = Date.now() + MANUAL_SCROLL_HOLD_MS
  }

  const seekTo = (line) => {
    if (audio) {
      audio.currentTime = (line.start ?? 0) / 1000
    }
    manualScrollUntil.current = 0
  }

  const statusText = loading
    ? translate('nowPlaying.lyricsLoading', { _: 'Looking for lyrics…' })
    : translate('nowPlaying.lyricsEmpty', { _: 'No lyrics for this track' })

  return (
    <section
      className={classes.root}
      aria-label={translate('nowPlaying.title', { _: 'Now playing' })}
    >
      {cover && (
        <div
          className={classes.glow}
          style={{ backgroundImage: `url("${cover}")` }}
        />
      )}
      <IconButton
        className={classes.close}
        onClick={onClose}
        aria-label={translate('ra.action.close', { _: 'Close' })}
      >
        <CloseIcon />
      </IconButton>
      <div className={classes.track}>
        {cover && <img className={classes.cover} src={cover} alt="" />}
        <div>
          <h2 className={classes.title}>{track.name}</h2>
          <p className={classes.artist}>{track.singer}</p>
        </div>
      </div>
      {lyrics ? (
        <div
          ref={containerRef}
          className={classes.lyrics}
          onWheel={holdAutoScroll}
          onTouchMove={holdAutoScroll}
        >
          {lyrics.lines.map((line, index) =>
            synced ? (
              <button
                type="button"
                key={`${index}-${line.start}`}
                aria-current={index === active ? 'true' : undefined}
                className={`${classes.line} ${classes.seekable} ${
                  index === active ? classes.active : ''
                }`}
                onClick={() => seekTo(line)}
              >
                {line.words
                  ? line.words.map((word) => (
                      <span
                        key={`${word.start}-${word.text}`}
                        className={classes.word}
                      >
                        {word.text}
                      </span>
                    ))
                  : line.value || '♪'}
              </button>
            ) : (
              <p key={index} className={`${classes.line} ${classes.plain}`}>
                {line.value}
              </p>
            ),
          )}
        </div>
      ) : (
        <p className={classes.status} role="status">
          {statusText}
        </p>
      )}
    </section>
  )
}
