import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({ color = Colors.black, size = 24 }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M17.75 3A3.25 3.25 0 0 1 21 6.25v6.749L16.251 13l-.213.007a3.25 3.25 0 0 0-2.714 1.832c-.42.114-.86.17-1.323.17-1.045 0-1.98-.29-2.824-.873a.75.75 0 1 0-.854 1.233 6.334 6.334 0 0 0 3.678 1.14c.227 0 .45-.01.671-.032l.329-.04L13 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3h11.5Zm2.591 11.72L14.72 20.34a2.25 2.25 0 0 1-.218.191L14.5 16.25l.006-.143c.069-.85.745-1.528 1.593-1.6l.151-.007h4.282a2.25 2.25 0 0 1-.192.22ZM9.001 7.75a1.25 1.25 0 1 0 0 2.499A1.25 1.25 0 0 0 9 7.75Zm6 0a1.25 1.25 0 1 0 0 2.499 1.25 1.25 0 0 0 0-2.499Z"
      fill={color}
      fillRule="nonzero"
    />
  </Svg>
)

export default SvgComponent
