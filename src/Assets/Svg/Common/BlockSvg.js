import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M12 2c5.524 0 10 4.478 10 10 0 5.524-4.476 10-10 10-5.522 0-10-4.476-10-10C2 6.479 6.479 2 12 2Zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-4.25 7.75h8.5a.75.75 0 0 1 .102 1.493l-.102.007h-8.5a.75.75 0 0 1-.102-1.493l.102-.007h8.5-8.5Z"
      fill={color}
      fillRule="nonzero"
    />
  </Svg>
)

export default SvgComponent
