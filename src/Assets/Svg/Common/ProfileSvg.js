import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={moderateScale(size)}
    width={moderateScale(size)}
    xmlSpace="preserve"
  >
    <Path
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SvgComponent
