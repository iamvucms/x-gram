import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M10.62 18.58c-.34.12-.9.12-1.24 0C6.48 17.59 0 13.46 0 6.46 0 3.37 2.49.87 5.56.87c1.82 0 3.43.88 4.44 2.24A5.53 5.53 0 0 1 14.44.87C17.51.87 20 3.37 20 6.46c0 7-6.48 11.13-9.38 12.12Z"
      fill={color}
    />
  </Svg>
)

export default SvgComponent
