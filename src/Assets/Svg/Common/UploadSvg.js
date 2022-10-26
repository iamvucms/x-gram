import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384.97 384.97"
    height={moderateScale(size)}
    width={moderateScale(size)}
    xmlSpace="preserve"
  >
    <Path
      fill={color}
      d="M372.939 264.641c-6.641 0-12.03 5.39-12.03 12.03v84.212H24.061v-84.212c0-6.641-5.39-12.03-12.03-12.03S0 270.031 0 276.671v96.242c0 6.641 5.39 12.03 12.03 12.03h360.909c6.641 0 12.03-5.39 12.03-12.03v-96.242c.001-6.652-5.389-12.03-12.03-12.03z"
    />
    <Path
      fill={color}
      d="m117.067 103.507 63.46-62.558v235.71c0 6.641 5.438 12.03 12.151 12.03s12.151-5.39 12.151-12.03V40.95l63.46 62.558c4.74 4.704 12.439 4.704 17.179 0 4.74-4.704 4.752-12.319 0-17.011L201.268 3.5c-4.692-4.656-12.584-4.608-17.191 0L99.888 86.496a11.942 11.942 0 0 0 0 17.011c4.74 4.704 12.439 4.704 17.179 0z"
    />
  </Svg>
)

export default SvgComponent
