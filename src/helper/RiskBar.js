import DOMParser from 'xmldom';
import * as canvas from 'canvas';
import { Canvg, presets } from 'canvg'

const preset = presets.node({
  DOMParser,
  canvas,
  fetch,
})

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

export const RiskBar = (width, height, score = 0, palette = "risk") => {
  const barWidth = score ? score / 100 * 350 : 0;
  const barRange = colorRanges.filter(range => (range.palette == palette)).find(range => (score <= range.max))
  const barColor = barRange?.color ?? 'black'
  const svg = `
  <svg version="1.1" viewBox="483 422 389 80" width="389" height="80">
    <style>
      tspan { font: bold 24px sans-serif; }
    </style>
    <defs />
    <g id="Canvas_23" fillOpacity="1" strokeOpacity="1" strokeDasharray="none" fill="none" stroke="none">
      <title>BarGraph</title>
      <g id="Canvas_23_Bar">
        <title>bargraph</title>
        <g id="Graphic_3">
          <rect x="515.5" y="451.9169" width="350" height="20" fill="#e5e5e5" />
        </g>
        <g id="Graphic_2">
          <rect x="515.5" y="451.9169" width="${barWidth}" height="20" fill="${barColor}" />
        </g>
        <g id="Graphic_5">
          <text transform="translate(488 452.776)" fill="${barColor}">
            <tspan fontFamily="Helvetica Neue" fontSize="32" fill="${isNaN(score) ? "#e5e5e5" : barColor}" x="7673862e-19" y="15">${isNaN(score) ? 'N/A' : score}</tspan>
          </text>
        </g>
      </g>
    </g>
  </svg>
`;
  const canvas = preset.createCanvas(200, 41)
  console.log('Blank canvas: ', canvas);
  const ctx = canvas.getContext('2d');
  const v = Canvg.fromString(ctx, svg);
  v.render();
  console.log('Filled canvas:', canvas)
  const image = canvas.toDataURL('image/png');
  console.log('Image: ', image);
  return image;
}
