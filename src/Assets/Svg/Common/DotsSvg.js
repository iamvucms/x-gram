import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 290 290"
    height={moderateScale(size)}
    width={moderateScale(size)}
  >
    <Path
      fill={color}
      d="M255 110c-19.299 0-35 15.701-35 35s15.701 35 35 35 35-15.701 35-35-15.701-35-35-35zM35 110c-19.299 0-35 15.701-35 35s15.701 35 35 35 35-15.701 35-35-15.701-35-35-35zM145 110c-19.299 0-35 15.701-35 35s15.701 35 35 35 35-15.701 35-35-15.701-35-35-35z"
    />
  </Svg>
)

export default SvgComponent
