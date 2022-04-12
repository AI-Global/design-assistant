import DOMParser from 'xmldom';
import * as canvas from 'canvas';
import { Canvg, presets } from 'canvg'

const preset = presets.node({
  DOMParser,
  canvas,
  fetch,
})

const mitigationGraph = `
<svg xmlns:dc="http://purl.org/dc/elements/1.1/" version="1.1" xmlns:xl="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="483 422 389 80" width="389" height="80">
  <defs/>
  <g id="Canvas_2" fill-opacity="1" stroke-opacity="1" stroke-dasharray="none" fill="none" stroke="none">
    <title>Mitigation</title>
    <g id="Canvas_2_Mitigation">
      <title>Mitigation</title>
      <g id="Graphic_29">
        <rect x="793.56" y="452.8" width="77.64" height="20.166234" fill="#70d49e"/>
      </g>
      <g id="Graphic_28">
        <rect x="715.92" y="452.8" width="77.64" height="20.166234" fill="#b2e988"/>
      </g>
      <g id="Graphic_27">
        <rect x="638.28" y="452.8" width="77.64" height="20.166234" fill="#e5eb99"/>
      </g>
      <g id="Graphic_26">
        <rect x="560.64" y="452.8" width="77.64" height="20.166234" fill="#e7ce8d"/>
      </g>
      <g id="Graphic_25">
        <rect x="483" y="452.8" width="77.64" height="20.166234" fill="#ee999a"/>
      </g>
      <g id="Graphic_24">
        <text transform="translate(488 429.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="0" y="15">Weak</tspan>
        </text>
      </g>
      <g id="Graphic_23">
        <text transform="translate(654.588 429.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="6252776e-19" y="15">Partial</tspan>
        </text>
      </g>
      <g id="Graphic_22">
        <text transform="translate(793 429.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="0" y="15">Optimized</tspan>
        </text>
      </g>
      <g id="Graphic_21">
        <text transform="translate(505.364 477.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="1278977e-19" y="15">0-19</tspan>
        </text>
      </g>
      <g id="Graphic_20">
        <text transform="translate(578.556 477.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">20-39</tspan>
        </text>
      </g>
      <g id="Graphic_19">
        <text transform="translate(653.396 477.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">40-59</tspan>
        </text>
      </g>
      <g id="Graphic_18">
        <text transform="translate(733.836 477.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">60-79</tspan>
        </text>
      </g>
      <g id="Graphic_17">
        <text transform="translate(807.028 477.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="7673862e-19" y="15">80-100</tspan>
        </text>
      </g>
    </g>
  </g>
</svg>
`

export const mitigation = (width, height) => {
  const svg = mitigationGraph;
  const canvas = preset.createCanvas(200, 41)
  const ctx = canvas.getContext('2d');
  const v = Canvg.fromString(ctx, svg);
  v.render();
  const image = canvas.toDataURL('image/png');
  return image;
}
