import stylesheet from './onyx.css.js'

const surface = {
  base: '#030303',
  raised: '#1a1a1a',
  hover: 'rgba(255, 255, 255, 0.1)',
  line: 'rgba(255, 255, 255, 0.1)',
}
const text = { primary: '#ffffff', secondary: '#aaaaaa' }
const accent = '#ff1744'

export default {
  themeName: 'Onyx',
  typography: {
    fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif",
    h6: { fontSize: '1.1rem', fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  palette: {
    type: 'dark',
    primary: { main: accent, contrastText: '#fff' },
    secondary: { main: '#ffffff', contrastText: '#030303' },
    background: { default: surface.base, paper: surface.raised },
    text: { primary: text.primary, secondary: text.secondary },
    divider: surface.line,
  },
  overrides: {
    MuiAppBar: {
      colorSecondary: {
        backgroundColor: surface.base,
        color: text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${surface.line}`,
      },
    },
    MuiPaper: {
      root: { backgroundImage: 'none' },
      elevation1: { boxShadow: 'none' },
    },
    MuiCard: {
      root: { backgroundColor: 'transparent' },
    },
    MuiLink: {
      root: { color: text.secondary },
    },
    RaLink: {
      link: { color: text.secondary, '&:hover': { color: text.primary } },
    },
    RaList: {
      content: { backgroundColor: 'transparent', boxShadow: 'none' },
    },
    MuiDrawer: {
      paper: { backgroundColor: surface.base, borderRight: 0 },
    },
    MuiButton: {
      root: { borderRadius: 999, textTransform: 'none', fontWeight: 500 },
      textPrimary: { color: text.primary },
    },
    MuiListItem: {
      button: { '&:hover': { backgroundColor: surface.hover } },
    },
    MuiMenuItem: {
      root: { borderRadius: 8 },
    },
    MuiTableRow: {
      root: { '&:hover': { backgroundColor: `${surface.hover} !important` } },
    },
    MuiTableCell: {
      root: { borderBottom: `1px solid ${surface.line}` },
      head: {
        color: text.secondary,
        fontWeight: 500,
        backgroundColor: 'transparent',
      },
    },
    RaDatagrid: {
      headerCell: { backgroundColor: 'transparent' },
    },
    MuiFilledInput: {
      root: {
        borderRadius: 8,
        backgroundColor: surface.hover,
        '&:hover': { backgroundColor: surface.hover },
        '&$focused': { backgroundColor: surface.hover },
      },
      underline: {
        '&:before': { borderBottom: 0 },
        '&:after': { borderBottom: 0 },
        '&:hover:before': { borderBottom: '0 !important' },
      },
    },
    MuiChip: {
      root: { backgroundColor: surface.hover },
    },
    RaMenuItemLink: {
      root: {
        margin: '2px 8px',
        borderRadius: 8,
        color: text.primary,
      },
      active: {
        backgroundColor: surface.hover,
        color: `${text.primary} !important`,
        fontWeight: 500,
      },
    },
    RaSidebar: {
      root: { backgroundColor: surface.base },
    },
    NDAppBar: {
      root: { backgroundColor: surface.base },
    },
    NDAudioPlayer: {
      audioTitle: { color: text.primary },
      songAlbum: { color: text.secondary, fontStyle: 'normal' },
    },
    RaPlaceholder: {
      root: { backgroundColor: surface.hover },
    },
    NDAlbumShow: {
      albumActions: {
        padding: '16px 0',
        '& button:first-child': {
          backgroundColor: text.primary,
          color: surface.base,
          padding: '6px 18px',
          borderRadius: 999,
          marginRight: 8,
          '&:hover': { backgroundColor: '#dddddd' },
        },
        '& button:first-child svg, & button:first-child span': {
          color: surface.base,
        },
      },
    },
    NDAlbumDetails: {
      root: { backgroundColor: 'transparent', boxShadow: 'none' },
      recordName: { fontWeight: 700 },
      cover: { borderRadius: 8 },
    },
    NDAlbumGridView: {
      albumContainer: {
        padding: '8px',
        '&:hover': { backgroundColor: 'transparent' },
      },
      link: { borderRadius: 8, overflow: 'hidden' },
      albumName: { fontWeight: 500, fontSize: '0.95rem' },
      albumSubtitle: { color: text.secondary },
    },
    NDLogin: {
      main: { backgroundColor: surface.base, boxShadow: 'none' },
      card: { backgroundColor: surface.raised },
    },
  },
  player: {
    theme: 'dark',
    stylesheet,
  },
}
