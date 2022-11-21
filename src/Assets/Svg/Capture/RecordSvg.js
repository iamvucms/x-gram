import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: style */

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 512 512"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M362.41 217.86v-69.22c0-14.74-11.95-26.68-26.68-26.68H70.18c-14.74 0-26.68 11.95-26.68 26.68v214.72c0 14.74 11.95 26.68 26.68 26.68h265.55c14.74 0 26.68-11.95 26.68-26.68v-69.22L468.5 355.4V156.6l-106.09 61.26zm-197.76 95.82V198.32l99.9 57.68-99.9 57.68z"
      fill={color}
      id="Layer_2"
    />
  </Svg>
)

export default SvgComponent
