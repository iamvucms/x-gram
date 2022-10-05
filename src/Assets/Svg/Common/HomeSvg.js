import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const HomeSvg = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 23 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M8.031 23.467v-3.822c0-.976.772-1.767 1.723-1.767h3.48c.457 0 .895.186 1.218.518.323.33.505.78.505 1.249v3.822c-.003.406.152.796.431 1.084.279.287.658.45 1.054.45h2.374a4.121 4.121 0 0 0 2.957-1.25A4.333 4.333 0 0 0 23 20.722V9.835c0-.918-.397-1.789-1.083-2.378L13.84.846a3.659 3.659 0 0 0-4.78.088L1.17 7.456A3.127 3.127 0 0 0 0 9.834V20.71c0 2.37 1.873 4.29 4.183 4.29h2.32c.822 0 1.49-.68 1.495-1.523l.033-.011Z"
      fill={color}
    />
  </Svg>
)

export default HomeSvg
