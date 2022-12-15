import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { memo } from 'react'
import { Colors, moderateScale } from '@/Theme'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 57.762 57.762"
    width={moderateScale(size)}
    height={moderateScale(size)}
  >
    <Path
      fill={color}
      d="M54.677 31.545a3.085 3.085 0 0 0-3.084 3.084v12.602l-11.39-11.39 6.171-6.171a3.085 3.085 0 0 0-4.362-4.362l-6.171 6.171-4.58-4.58c4.621-6.682 3.964-15.938-1.981-21.882-6.689-6.689-17.574-6.689-24.263 0s-6.689 17.574 0 24.263c5.945 5.945 15.2 6.602 21.882 1.981l4.58 4.58-6.171 6.171a3.085 3.085 0 0 0 4.362 4.362l6.171-6.171 11.39 11.39H34.629c-.851 0-1.623.345-2.181.903a3.085 3.085 0 0 0 2.182 5.266h20.048a3.084 3.084 0 0 0 3.084-3.084V34.629a3.085 3.085 0 0 0-3.085-3.084zM9.379 24.919c-4.284-4.284-4.284-11.255 0-15.54 4.284-4.284 11.255-4.284 15.54 0 4.284 4.284 4.284 11.255 0 15.54-4.285 4.284-11.256 4.284-15.54 0z"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
