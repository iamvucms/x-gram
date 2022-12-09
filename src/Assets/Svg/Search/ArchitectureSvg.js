import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 -4 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M9 25v5a1 1 0 0 0 1 1h14v-6Zm15 0v6h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Zm0-12H10a.923.923 0 0 0-1 .9V19h15v-6Zm0 0v6h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1ZM2 19a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14v-6Zm14 6h15v-6H16ZM30 7H17a.923.923 0 0 0-1 .9V13h15V7.9a.923.923 0 0 0-1-.9ZM2 7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14V7.9a.923.923 0 0 0-1-.9Zm8-6a1 1 0 0 0-1 1v5h15V2a1 1 0 0 0-1-1Z"
      fill="none"
      stroke={color}
      strokeLinecap="square"
      strokeWidth={2}
      data-name="Group 60"
    />
  </Svg>
)

export default SvgComponent
