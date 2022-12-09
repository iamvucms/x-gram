import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="m4 16 11 .001a2 2 0 0 1 1.995 1.85l.005.15V20.5c-.001 4.2-4.287 5.5-7.5 5.5-3.149 0-7.329-1.249-7.495-5.251L2 20.5V18c0-1.054.816-1.918 1.85-1.995L4 16Zm13.22.001L24 16c1.054 0 1.918.816 1.995 1.85L26 18v2c-.001 3.759-3.43 5-6 5-1.058 0-2.259-.215-3.309-.725.752-.894 1.24-2.032 1.302-3.464L18 20.5v-2.499c0-.702-.249-1.34-.654-1.85L17.22 16 24 16l-6.78.001ZM9.5 3a5.5 5.5 0 1 1-.001 11.001A5.5 5.5 0 0 1 9.5 3Zm11 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
      fill={color}
      fillRule="nonzero"
    />
  </Svg>
)

export default SvgComponent
