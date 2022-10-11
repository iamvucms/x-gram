import { moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'

const SvgComponent = ({ size = 24 }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 75 75"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Defs>
      <LinearGradient id="gradient">
        <Stop offset="0" stopColor="#FF7A51" />
        <Stop offset="1" stopColor="#FFDB5C" />
      </LinearGradient>
    </Defs>
    <Path
      strokeWidth="2"
      d="M37.5 75C58.125 75 75 58.125 75 37.5S58.125 0 37.5 0 0 16.875 0 37.5 16.875 75 37.5 75Z"
      fill="url(#gradient)"
    />
    <Path
      d="M30.681 37.5h13.637M37.5 44.318V30.68"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SvgComponent
