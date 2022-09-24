import { moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const ChevronRightSvg = ({ size = 18, color = '#494c4e' }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fill={color}
      d="M5.49 15.61a1.5 1.5 0 0 1-.1-2.12L9.47 9 5.39 4.51a1.5 1.5 0 1 1 2.22-2.02L12.62 8A1.474 1.474 0 0 1 13 9a1.524 1.524 0 0 1-.38 1l-5.01 5.51a1.5 1.5 0 0 1-2.12.1z"
    />
  </Svg>
)

export default ChevronRightSvg
