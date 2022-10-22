import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { G, Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <G stroke={color} strokeWidth={4}>
        <Path d="M36 19H12M42 9H6M42 29H6M36 39H12" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent
