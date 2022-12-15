import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { memo } from 'react'
import { Colors, moderateScale } from '@/Theme'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 466.008 466.008"
    width={moderateScale(size)}
    height={moderateScale(size)}
    xmlSpace="preserve"
  >
    <Path
      fill={color}
      d="M233.004 0C104.224 0 0 104.212 0 233.004c0 128.781 104.212 233.004 233.004 233.004 128.782 0 233.004-104.212 233.004-233.004C466.008 104.222 361.796 0 233.004 0zm11.48 242.659-63.512 75.511c-5.333 6.34-14.797 7.156-21.135 1.824-6.34-5.333-7.157-14.795-1.824-21.135l59.991-71.325V58.028c0-8.284 6.716-15 15-15s15 6.716 15 15v174.976c0 3.532-1.247 6.952-3.52 9.655z"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
