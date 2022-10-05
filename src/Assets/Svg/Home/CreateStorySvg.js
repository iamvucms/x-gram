import { moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

const SvgComponent = ({ size = 90 }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 90 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect
      x={1}
      y={1}
      width={88}
      height={86}
      rx={39}
      stroke="#fff"
      strokeOpacity={0.2}
      strokeWidth={2}
    />
    <Rect
      x={10}
      y={10}
      width={70}
      height={68}
      rx={28}
      fill="#F8F8F8"
      fillOpacity={0.1}
    />
    <Path
      d="M37 44h16M45 52V36"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SvgComponent
