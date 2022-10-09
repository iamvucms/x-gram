import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fill={color}
      d="M17 3H7a5.006 5.006 0 0 0-5 5v8a5.006 5.006 0 0 0 5 5h10a5.006 5.006 0 0 0 5-5V8a5.006 5.006 0 0 0-5-5ZM7 5h10a3 3 0 0 1 3 3v4.586L16.417 9a2.007 2.007 0 0 0-2.834 0L9 13.586 8.417 13a2.007 2.007 0 0 0-2.834 0L4 14.586V8a3 3 0 0 1 3-3Zm-.5 4A1.5 1.5 0 1 1 8 10.5 1.5 1.5 0 0 1 6.5 9Z"
    />
  </Svg>
)

export default SvgComponent
