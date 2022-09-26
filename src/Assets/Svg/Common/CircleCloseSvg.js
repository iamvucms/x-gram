import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Rect, Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect x={0.5} y={0.5} width={17.5} height={17.5} rx={8.75} stroke={color} />
    <Path
      d="m11.795 7.002-4.792 4.792M11.796 11.797 7 7"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SvgComponent
