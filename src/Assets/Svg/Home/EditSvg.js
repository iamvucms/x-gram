import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 490.584 490.584"
    height={moderateScale(size)}
    width={moderateScale(size)}
    xmlSpace="preserve"
  >
    <Path
      fill={color}
      d="m100.911 419.404 123.8-51c3.1-2.1 6.2-4.2 8.3-6.2l203.9-248.6c6.2-9.4 5.2-21.8-3.1-29.1l-96.8-80.1c-8-5.9-20.3-6.8-28.1 3.1l-204.9 248.5c-2.1 3.1-3.1 6.2-4.2 9.4l-26 132.1c-1.3 22.6 16.8 26.5 27.1 21.9zm225.7-370.4 65.5 54.1-177.7 217.1-64.9-53.7 177.1-217.5zm-193.2 257.9 44.4 36.8-57.2 23.6 12.8-60.4z"
    />
    <Path
      fill={color}
      d="M469.111 448.504h-349.5s-72.5 3.4-75.2-15.2c0-1-1.8-5.6 7.6-17 7.3-9.4 6.2-21.8-2.1-29.1-9.4-7.3-21.8-6.2-29.1 2.1-19.8 23.9-25 44.7-15.6 63.5 25.5 47.5 111.3 36.3 115.4 37.3h348.5c11.4 0 20.8-9.4 20.8-20.8.1-11.5-9.3-20.8-20.8-20.8z"
    />
  </Svg>
)

export default SvgComponent
