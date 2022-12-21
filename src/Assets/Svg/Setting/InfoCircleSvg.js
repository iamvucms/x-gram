import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { memo } from 'react'
import { Colors, moderateScale } from '@/Theme'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 330 330"
    width={moderateScale(size)}
    height={moderateScale(size)}
    xmlSpace="preserve"
  >
    <Path
      fill={color}
      d="M165 .008C74.019.008 0 74.024 0 164.999c0 90.977 74.019 164.992 165 164.992s165-74.015 165-164.992C330 74.024 255.981.008 165 .008zm0 299.984c-74.439 0-135-60.557-135-134.992S90.561 30.008 165 30.008s135 60.557 135 134.991c0 74.437-60.561 134.993-135 134.993z"
    />
    <Path
      fill={color}
      d="M165 130.008c-8.284 0-15 6.716-15 15v99.983c0 8.284 6.716 15 15 15s15-6.716 15-15v-99.983c0-8.283-6.716-15-15-15zM165 70.011c-3.95 0-7.811 1.6-10.61 4.39-2.79 2.79-4.39 6.66-4.39 10.61s1.6 7.81 4.39 10.61c2.79 2.79 6.66 4.39 10.61 4.39s7.81-1.6 10.609-4.39c2.79-2.8 4.391-6.66 4.391-10.61s-1.601-7.82-4.391-10.61A15.12 15.12 0 0 0 165 70.011z"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
