import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: style */

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    height={moderateScale(size)}
    width={moderateScale(size)}
    viewBox="0 0 32 32"
  >
    <Path
      strokeWidth={2}
      stroke={color}
      d="M10 12h9M10 16h4M11 4c-4.4 0-8 3.6-8 8v17h0c3.7-3.2 8.4-5 13.3-5H21c4.4 0 8-3.6 8-8v-4c0-4.4-3.6-8-8-8H11z"
    />
  </Svg>
)

export default SvgComponent
