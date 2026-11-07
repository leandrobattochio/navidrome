const accent = '#ff1744'

const stylesheet = `
.react-jinke-music-player-main .music-player-panel {
  height: 72px;
  background: #1a1a1a;
  box-shadow: none;
}
.react-jinke-music-player-main .music-player-panel .panel-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 72px;
  padding: 0 16px;
  justify-content: flex-start;
  overflow: visible;
}
.react-jinke-music-player-main .music-player-panel .panel-content .player-content {
  display: contents;
}
.react-jinke-music-player-main .music-player-panel .panel-content .player-content > * {
  order: 4;
  flex: none;
  margin: 0;
  padding: 0 4px;
}
.react-jinke-music-player-main .music-player-panel .panel-content .player-content > .group {
  flex: none;
  width: auto;
  min-width: 0;
  padding: 0 4px;
}
.react-jinke-music-player-main .music-player-panel .panel-content .player-content > .group:first-child {
  order: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.react-jinke-music-player-main .music-player-panel .panel-content .img-content {
  order: 1;
  flex: none;
  width: 40px;
  height: 40px;
  margin: 0 0 0 16px;
  border-radius: 2px;
  box-shadow: none;
  animation: none;
}
.react-jinke-music-player-main .music-player-panel .panel-content .img-content img {
  border-radius: 2px;
  animation: none;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content {
  order: 2;
  flex: 1 1 0;
  display: block;
  width: auto;
  max-width: none;
  min-width: 0;
  height: auto;
  padding: 0 0 0 8px;
  margin: 0;
  background: none;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content .audio-title {
  height: auto;
  margin: 0;
  color: #fff;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content .audio-title a,
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content .audio-title span {
  color: inherit;
  font-style: normal;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content .audio-main {
  position: absolute;
  top: -5px;
  left: 0;
  right: 0;
  margin: 0;
  height: 10px;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content .audio-main .current-time,
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content .audio-main .duration {
  display: none;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar-content .audio-main .progress-bar {
  margin: 0;
  width: 100%;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar .rc-slider::before {
  content: '';
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: 0;
  right: 0;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar .rc-slider-handle {
  transition: left 1s linear, box-shadow 120ms;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar .rc-slider-track {
  transition: width 1s linear;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar .rc-slider:active .rc-slider-handle,
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar .rc-slider:active .rc-slider-track {
  transition: none;
}
.react-jinke-music-player-main .music-player-panel .panel-content .play-sounds {
  display: flex;
  align-items: center;
  width: auto;
}
.react-jinke-music-player-main .music-player-panel .panel-content .sound-operation {
  width: 96px;
  margin-left: 8px;
}
.react-jinke-music-player-main .music-player-panel .panel-content .player-content .audio-lists-btn {
  width: auto;
  min-width: 0;
  height: auto;
  background: none;
  box-shadow: none;
  border: 0;
}
.react-jinke-music-player-main .music-player-panel .panel-content .progress-bar .rc-slider-rail,
.react-jinke-music-player-main .music-player-panel .panel-content .progress-load-bar {
  background: rgba(255, 255, 255, 0.2);
}
.react-jinke-music-player-main .music-player-panel svg { color: #fff; }
.react-jinke-music-player-main .music-player-panel button:disabled svg { opacity: 0.3; }
.react-jinke-music-player-main .music-player-panel .panel-content .rc-slider-rail { background: rgba(255, 255, 255, 0.2); }
.react-jinke-music-player-main .music-player-panel .panel-content .rc-slider-track,
.react-jinke-music-player-main .music-player-panel .panel-content .rc-slider-handle {
  background-color: ${accent};
  border-color: ${accent};
}
.react-jinke-music-player-main .music-player-panel .panel-content .rc-slider-handle:hover,
.react-jinke-music-player-main .music-player-panel .panel-content .rc-slider-handle:active { box-shadow: 0 0 0 4px rgba(255, 23, 68, 0.3); }
.react-jinke-music-player-mobile { background: #0a0a0a; }
.react-jinke-music-player-mobile-progress .rc-slider-track,
.react-jinke-music-player-mobile-progress .rc-slider-handle { background-color: ${accent}; }
.audio-lists-panel { background: #1a1a1a; }
.audio-lists-panel-header { background: #1a1a1a; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.audio-lists-panel-content .audio-item { background: transparent; }
.audio-lists-panel-content .audio-item:hover { background: rgba(255, 255, 255, 0.08); }
.audio-lists-panel-content .audio-item.playing,
.audio-lists-panel-content .audio-item.playing svg { color: ${accent}; }
`

export default stylesheet
