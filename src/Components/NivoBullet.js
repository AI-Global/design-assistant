// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bullet
import { ResponsiveBullet } from '@nivo/bullet'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const NivoBullet = ({ data /* see data tab */ }) => (
  <ResponsiveBullet
    data={data}
    margin={{ top: 50, right: 90, bottom: 50, left: 200 }}
    spacing={45}
    titleAlign="start"
    titleOffsetX={-200}
    minValue={0}
    maxValue={100}
    measureSize={0.8}
    rangeColors="blues"
    measureColors="seq:blue_green"
    markerColors="seq:blue_green"
  />
)

export default NivoBullet;