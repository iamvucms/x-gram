import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path, Circle } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.854 8C3.83 8 3 8.83 3 9.854v5.003c0 2.005 0 3.007.46 3.74a3 3 0 0 0 .944.943c.732.46 1.734.46 3.739.46h7.714c2.005 0 3.007 0 3.74-.46a3 3 0 0 0 .943-.944c.46-.732.46-1.734.46-3.739V9.854C21 8.83 20.17 8 19.146 8a1.854 1.854 0 0 1-1.659-1.025l-.82-1.642c-.11-.22-.165-.33-.228-.425a2 2 0 0 0-1.447-.895C14.877 4 14.755 4 14.508 4H9.491c-.246 0-.37 0-.483.013a2 2 0 0 0-1.447.895c-.063.095-.118.205-.228.425l-.82 1.642A1.854 1.854 0 0 1 4.853 8ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      fill={color}
      fillOpacity={0.1}
    />
    <Path
      d="M3 9.854C3 8.83 3.83 8 4.854 8c.702 0 1.344-.397 1.658-1.025l.821-1.642c.11-.22.165-.33.228-.425a2 2 0 0 1 1.447-.895C9.122 4 9.245 4 9.491 4h5.018c.246 0 .37 0 .482.013a2 2 0 0 1 1.448.895c.063.095.118.205.228.425l.82 1.642A1.854 1.854 0 0 0 19.146 8C20.17 8 21 8.83 21 9.854v5.003c0 2.005 0 3.007-.46 3.74a3 3 0 0 1-.944.943c-.732.46-1.734.46-3.739.46H8.143c-2.005 0-3.007 0-3.74-.46a3 3 0 0 1-.943-.944C3 17.864 3 16.862 3 14.857V9.854Z"
      stroke={color}
      strokeOpacity={0.9}
      strokeWidth={1.2}
    />
    <Circle
      cx={12}
      cy={13}
      r={3.4}
      stroke={color}
      strokeOpacity={0.9}
      strokeWidth={1.2}
    />
  </Svg>
)

export default SvgComponent
