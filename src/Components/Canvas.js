import React, { useRef, useEffect } from 'react';
import { Canvg } from 'canvg';

const testImage = `data:image/png;base64,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`
const testSVG = `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" version="1.1" xmlns:xl="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="367 305 389 80" width="389" height="80">
  <defs/>
  <g id="Canvas_1" fill-opacity="1" stroke-opacity="1" stroke-dasharray="none" fill="none" stroke="none">
    <title>Risk</title>
    <g id="Canvas_1_Risk">
      <title>Risk</title>
      <g id="Graphic_44">
        <rect x="367" y="335.8" width="77.64" height="20.166234" fill="#70d49e"/>
      </g>
      <g id="Graphic_43">
        <rect x="444.64" y="335.8" width="77.64" height="20.166234" fill="#b2e988"/>
      </g>
      <g id="Graphic_42">
        <rect x="522.28" y="335.8" width="77.64" height="20.166234" fill="#e5eb99"/>
      </g>
      <g id="Graphic_41">
        <rect x="599.92" y="335.8" width="77.64" height="20.166234" fill="#e7ce8d"/>
      </g>
      <g id="Graphic_40">
        <rect x="677.56" y="335.8" width="77.64" height="20.166234" fill="#ee999a"/>
      </g>
      <g id="Graphic_39">
        <text transform="translate(372 312.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="0" y="15">Lower</tspan>
        </text>
      </g>
      <g id="Graphic_38">
        <text transform="translate(532.044 312.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4973799e-19" y="15">Medium</tspan>
        </text>
      </g>
      <g id="Graphic_37">
        <text transform="translate(717.016 312.352)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="11084467e-19" y="15">High</tspan>
        </text>
      </g>
      <g id="Graphic_36">
        <text transform="translate(389.364 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="1278977e-19" y="15">0-19</tspan>
        </text>
      </g>
      <g id="Graphic_35">
        <text transform="translate(462.556 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">20-39</tspan>
        </text>
      </g>
      <g id="Graphic_34">
        <text transform="translate(537.396 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">40-59</tspan>
        </text>
      </g>
      <g id="Graphic_33">
        <text transform="translate(617.836 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="4476419e-19" y="15">60-79</tspan>
        </text>
      </g>
      <g id="Graphic_32">
        <text transform="translate(691.028 360.96623)" fill="black">
          <tspan font-family="Helvetica Neue" font-size="16" fill="black" x="7673862e-19" y="15">80-100</tspan>
        </text>
      </g>
    </g>
  </g>
</svg>`


const Canvas = props => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  let image = testImage;

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let v = Canvg.fromString(context, testSVG)
    v.start();
    image = canvas.toDataURL('image/png');
    imgRef.current.src = image;
  }, [])

  return (
    <div>
      <p>Here is the canvas:</p>
      <canvas
        ref={canvasRef}
        {...props}
      />
      <p>Here is the bitmap:</p>
      <img ref={imgRef} src={image} />
    </div>
  );
}

export default Canvas
