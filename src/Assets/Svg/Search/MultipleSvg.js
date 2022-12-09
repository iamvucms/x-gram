import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fill={color}
      d="M27 3.56A1.56 1.56 0 0 0 25.43 2H5.57A1.56 1.56 0 0 0 4 3.56v24.88A1.56 1.56 0 0 0 5.57 30h.52V4.07H27Z"
      className="clr-i-solid clr-i-solid-path-1"
    />
    <Rect
      fill={color}
      x={8}
      y={6}
      width={23}
      height={28}
      rx={1.5}
      ry={1.5}
      className="clr-i-solid clr-i-solid-path-2"
    />
    <Path fill="none" d="M0 0h36v36H0z" />
  </Svg>
)

export default SvgComponent
