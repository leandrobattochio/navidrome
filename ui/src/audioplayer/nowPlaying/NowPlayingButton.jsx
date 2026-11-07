import React from 'react'
import { useTranslate } from 'react-admin'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import { RiMicLine } from 'react-icons/ri'

const useStyles = makeStyles(
  (theme) => ({
    button: { width: '2.5rem', height: '2.5rem', padding: 0 },
    active: { color: theme.palette.primary.main },
  }),
  { name: 'NDNowPlayingButton' },
)

export const NowPlayingButton = ({ active, onClick }) => {
  const classes = useStyles()
  const translate = useTranslate()
  const label = translate('player.toggleLyricText', { _: 'Toggle lyrics' })

  return (
    <IconButton
      size="small"
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`${classes.button} ${active ? classes.active : ''}`}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <RiMicLine />
    </IconButton>
  )
}
