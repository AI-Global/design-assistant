import React from 'react'
import PropTypes from 'prop-types'

const colorRanges = [
  { palette: 'risk', min: 0, max: 19, color: "#70d49e" },
  { palette: 'risk', min: 20, max: 39, color: "#b2e988" },
  { palette: 'risk', min: 40, max: 59, color: "#e5eb99" },
  { palette: 'risk', min: 60, max: 79, color: "#e7ce8d" },
  { palette: 'risk', min: 80, max: 100, color: "#ee999a" },
  { palette: 'mitigation', min: 0, max: 19, color: "#ee999a" },
  { palette: 'mitigation', min: 20, max: 39, color: "#e7ce8d" },
  { palette: 'mitigation', min: 40, max: 59, color: "#e5eb99" },
  { palette: 'mitigation', min: 60, max: 79, color: "#b2e988" },
  { palette: 'mitigation', min: 80, max: 100, color: "#70d49e" },
];

const BarGraph = ({ score = 0, palette = "risk" }) => {
  const barWidth = score / 100 * 350;
  console.log('score', score, score === NaN)
  const barRange = colorRanges.filter(range => (range.palette == palette)).find(range => (score <= range.max))
  const barColor = barRange?.color ?? 'black'
  return <svg version="1.1" viewBox="483 422 389 80" width="389" height="80">
    <defs />
    <g id="BarGraph" fill-opacity="1" stroke-opacity="1" stroke-dasharray="none" fill="none" stroke="none">
      <title>BarGraph</title>
      <g id="BarGraph_bargraph">
        <title>bargraph</title>
        <g id="Graphic_3">
          <rect x="515.5" y="451.9169" width="350" height="20" fill="#e5e5e5" />
        </g>
        <g id="Graphic_2">
          <rect x="515.5" y="451.9169" width={barWidth} height="20" fill={barColor} />
        </g>
        <g id="Graphic_5">
          <text transform="translate(488 452.776)" fill={barColor}>
            <tspan font-family="Helvetica Neue" font-size="16" fill={isNaN(score) ? "#e5e5e5" : barColor} x="6394885e-19" y="15">{isNaN(score) ? 'N/A' : score}</tspan>
          </text>
        </g>
      </g>
    </g>
  </svg>
}

export const ScoreBar = ({ score, palette }) => {
  return (
    <>
      <div>
        <BarGraph score={score} palette={palette} />
      </div>
    </>
  );
}

ScoreBar.propTypes = {
  score: PropTypes.number,
  palette: PropTypes.string,
}
