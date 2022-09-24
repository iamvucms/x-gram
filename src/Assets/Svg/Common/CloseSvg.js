import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { G, Path } from 'react-native-svg'

const CloseSvg = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <G data-name="Layer 2">
      <Path
        fill={color}
        d="m13.41 12 4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
        data-name="close"
      />
    </G>
  </Svg>
)

export default CloseSvg
