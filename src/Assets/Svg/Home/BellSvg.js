import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 25 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M12.5 7.208v3.469M12.523 2.584a6.935 6.935 0 0 0-6.937 6.937v2.188c0 .708-.292 1.77-.656 2.375l-1.323 2.208c-.813 1.365-.25 2.886 1.25 3.386a24.312 24.312 0 0 0 15.343 0 2.312 2.312 0 0 0 1.25-3.386l-1.322-2.208c-.365-.604-.657-1.677-.657-2.375V9.521c-.01-3.812-3.135-6.937-6.948-6.937Z"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
    />
    <Path
      d="M15.969 20.104a3.481 3.481 0 0 1-3.469 3.468 3.475 3.475 0 0 1-2.448-1.02 3.475 3.475 0 0 1-1.02-2.448"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
    />
  </Svg>
)

export default SvgComponent
