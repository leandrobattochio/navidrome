const pad = (value) => value.toString().padStart(2, '0')

const lrcTimestamp = (ms) => {
  const totalCentiseconds = Math.floor(ms / 10)
  const totalSeconds = Math.floor(totalCentiseconds / 100)
  const minutes = Math.floor(totalSeconds / 60)
  return `[${pad(minutes)}:${pad(totalSeconds % 60)}.${pad(totalCentiseconds % 100)}]`
}

// The player only renders timed lines, so unsynced ones get approximate times.
export const lyricsToLrc = (structuredLyrics, durationSeconds) => {
  if (!Array.isArray(structuredLyrics)) {
    return ''
  }
  const hasLines = (lyrics) => lyrics.line?.length > 0
  const lyrics =
    structuredLyrics.find((item) => item.synced && hasLines(item)) ||
    structuredLyrics.find(hasLines)
  if (!lyrics) {
    return ''
  }
  if (lyrics.synced) {
    return lyrics.line
      .map((line) => `${lrcTimestamp(line.start ?? 0)} ${line.value}`)
      .join('\n')
  }
  if (!durationSeconds) {
    return ''
  }
  const msPerLine = (durationSeconds * 1000) / lyrics.line.length
  return lyrics.line
    .map((line, index) => `${lrcTimestamp(index * msPerLine)} ${line.value}`)
    .join('\n')
}
