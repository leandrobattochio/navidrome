const encoder = new TextEncoder()
const decoder = new TextDecoder()

// Cue offsets are UTF-8 bytes and byteEnd is inclusive; null keeps line highlighting.
export const buildWords = (value, cues, lineEnd) => {
  const bytes = encoder.encode(value)
  const sorted = [...cues].sort((a, b) => a.byteStart - b.byteStart)
  const text = (from, to) => decoder.decode(bytes.slice(from, to))
  const words = []
  let cursor = 0
  for (const [index, cue] of sorted.entries()) {
    if (
      cue.start == null ||
      cue.byteStart < cursor ||
      cue.byteEnd < cue.byteStart ||
      cue.byteEnd >= bytes.length
    ) {
      return null
    }
    const gap = text(cursor, cue.byteStart)
    if (words.length) {
      words[words.length - 1].text += gap
    } else if (gap) {
      words.push({ text: gap, start: cue.start, end: cue.start })
    }
    words.push({
      text: text(cue.byteStart, cue.byteEnd + 1),
      start: cue.start,
      end: cue.end ?? sorted[index + 1]?.start ?? lineEnd ?? cue.start,
    })
    cursor = cue.byteEnd + 1
  }
  if (!words.length) {
    return null
  }
  words[words.length - 1].text += text(cursor, bytes.length)
  return words.map((word) => word.text).join('') === value ? words : null
}

const withWords = ({ line, cueLine }) => {
  if (!cueLine?.length) {
    return line
  }
  const cuesByLine = new Map()
  for (const item of cueLine) {
    if (!cuesByLine.has(item.index)) {
      cuesByLine.set(item.index, item.cue || [])
    }
  }
  return line.map((current, index) => {
    const cues = cuesByLine.get(index)
    const words =
      cues && buildWords(current.value, cues, line[index + 1]?.start)
    return words ? { ...current, words } : current
  })
}

export const pickLyrics = (structuredLyrics) => {
  if (!Array.isArray(structuredLyrics)) {
    return null
  }
  const hasLines = (lyrics) =>
    lyrics.line?.length > 0 && (!lyrics.kind || lyrics.kind === 'main')
  const lyrics =
    structuredLyrics.find((item) => item.synced && hasLines(item)) ||
    structuredLyrics.find(hasLines)
  if (!lyrics) {
    return null
  }
  return { synced: !!lyrics.synced, lines: withWords(lyrics) }
}

export const wordProgress = (word, positionMs) => {
  if (positionMs < word.start) {
    return 0
  }
  if (positionMs >= word.end) {
    return 1
  }
  return (positionMs - word.start) / (word.end - word.start)
}

export const findActiveLine = (lines, positionMs) => {
  let low = 0
  let high = lines.length - 1
  let active = -1
  while (low <= high) {
    const middle = Math.floor((low + high) / 2)
    if ((lines[middle].start ?? 0) <= positionMs) {
      active = middle
      low = middle + 1
    } else {
      high = middle - 1
    }
  }
  return active
}
