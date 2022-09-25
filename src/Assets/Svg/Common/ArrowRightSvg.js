import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 17 15"
  >
    <Path
      d="M0 7.726a.75.75 0 0 1 .648-.744l.102-.006h13.184L9.171 2.233a.75.75 0 0 1 .974-1.136l.084.073 6.05 6.024a.751.751 0 0 1 .22.503l.001.029v.029l-.003.044.003-.073a.753.753 0 0 1-.148.446l-.006.01a.748.748 0 0 1-.066.074l-6.05 6.026a.75.75 0 0 1-1.132-.98l.073-.083 4.761-4.743H.75a.75.75 0 0 1-.75-.75Z"
      fill={color}
    />
  </Svg>
)

export default SvgComponent
