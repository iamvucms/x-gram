import { moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const ExampleSvg = ({ size = 20, color = '#063855' }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 48 1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path d="M0 0h48v1H0z" fill={color} fillRule="evenodd" />
  </Svg>
)

export default ExampleSvg
