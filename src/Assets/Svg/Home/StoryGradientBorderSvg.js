import { moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg'

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
      stroke="url(#a)"
      strokeWidth={2}
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={45}
        y1={2}
        x2={45}
        y2={86}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#FF7A51" />
        <Stop offset={1} stopColor="#FFDB5C" />
      </LinearGradient>
    </Defs>
  </Svg>
)

export default SvgComponent
