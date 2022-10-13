import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M5.25 5.5A3.25 3.25 0 0 0 2 8.75v10.5a3.25 3.25 0 0 0 3.25 3.25h9.5A3.25 3.25 0 0 0 18 19.25V8.75a3.25 3.25 0 0 0-3.25-3.25h-9.5ZM23.123 20.643l-3.623-3.55V11l3.612-3.628c.787-.79 2.136-.233 2.136.882V19.75c0 1.108-1.334 1.668-2.125.893Z"
      fill={color}
    />
  </Svg>
)

export default SvgComponent
