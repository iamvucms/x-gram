import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const HomeSvg = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 330.242 330.242"
    height={moderateScale(size)}
    width={moderateScale(size)}
    xmlSpace="preserve"
  >
    <Path
      fill={color}
      d="m324.442 129.811-41.321-33.677V42.275c0-6.065-4.935-11-11-11h-26c-6.065 0-11 4.935-11 11v14.737l-55.213-44.999c-3.994-3.254-9.258-5.047-14.822-5.047-5.542 0-10.781 1.782-14.753 5.019L5.8 129.81c-6.567 5.351-6.173 10.012-5.354 12.314.817 2.297 3.448 6.151 11.884 6.151h19.791v154.947c0 11.058 8.972 20.053 20 20.053h62.5c10.935 0 19.5-8.809 19.5-20.053v-63.541c0-5.446 5.005-10.405 10.5-10.405h42c5.238 0 9.5 4.668 9.5 10.405v63.541c0 10.87 9.388 20.053 20.5 20.053h61.5c11.028 0 20-8.996 20-20.053V148.275h19.791c8.436 0 11.066-3.854 11.884-6.151.819-2.302 1.213-6.963-5.354-12.313z"
    />
  </Svg>
)

export default HomeSvg
