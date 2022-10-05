import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({
  size = 24,
  color = Colors.black,
  pointColor = Colors.kB8FF8D,
}) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M22 10v5c0 3.5-2 5-5 5H7c-3 0-5-1.5-5-5V8c0-3.5 2-5 5-5h7"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="m7 9 3.13 2.5c1.03.82 2.72.82 3.75 0l1.18-.94"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M19.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill={pointColor} />
  </Svg>
)

export default SvgComponent
