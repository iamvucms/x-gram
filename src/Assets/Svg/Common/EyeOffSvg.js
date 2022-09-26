import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 21 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.511 11.066a2.765 2.765 0 0 1-1.936-4.74.483.483 0 0 0-.675-.688 3.73 3.73 0 1 0 5.275 5.275.483.483 0 0 0-.69-.676 2.756 2.756 0 0 1-1.974.83Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.861 12.296c1.55 1.904 4.013 3.86 7.567 3.86 2.41 0 4.329-.902 5.8-2.08a.473.473 0 0 0 .072-.667.481.481 0 0 0-.673-.072c-1.336 1.069-3.049 1.869-5.2 1.869-3.157 0-5.372-1.728-6.821-3.508a14.025 14.025 0 0 1-2.018-3.38 14.912 14.912 0 0 1 .854-1.652c.631-1.054 1.585-2.363 2.884-3.417a.473.473 0 0 0 .068-.668.481.481 0 0 0-.674-.067C3.305 3.662 2.284 5.069 1.619 6.18c-.334.557-.58 1.044-.745 1.393a11.577 11.577 0 0 0-.244.558l-.003.01-.001.002v.001l.446.17-.45.16v.001l.002.006a3.054 3.054 0 0 0 .033.086c.023.058.056.142.1.247a14.972 14.972 0 0 0 2.103 3.482ZM1.072 8.313l-.45.16a.472.472 0 0 1 .003-.329l.447.17ZM16.844 12.599a.478.478 0 0 0 .67-.037 14.595 14.595 0 0 0 2.642-4.233l.002-.006v-.002h.001l-.446-.161.443-.167V7.99l-.002-.006-.008-.018a6.893 6.893 0 0 0-.133-.313A15.728 15.728 0 0 0 17.86 4.19C16.3 2.299 13.853.345 10.413.345c-1.551 0-2.906.4-4.068 1.013a.467.467 0 0 0-.195.636.477.477 0 0 0 .642.193 7.65 7.65 0 0 1 3.621-.903c3.04 0 5.242 1.72 6.712 3.5a14.792 14.792 0 0 1 2.076 3.38 12.932 12.932 0 0 1-.52 1.087 13.66 13.66 0 0 1-1.874 2.686.466.466 0 0 0 .037.663Zm2.869-4.439.444-.167c.04.105.04.221.002.327l-.446-.16Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.428 9.274c.247.045.48-.134.522-.4.032-.204.05-.415.05-.632 0-2.083-1.568-3.773-3.504-3.773-.202 0-.397.02-.587.054-.247.044-.413.296-.371.562.041.266.275.445.522.4.143-.026.289-.04.436-.04 1.435 0 2.598 1.253 2.598 2.797 0 .159-.014.315-.038.47-.041.266.125.518.372.562ZM6.781 8.301a3.73 3.73 0 0 0 6.393 2.612.483.483 0 0 0-.688-.676 2.765 2.765 0 1 1-3.91-3.91.483.483 0 0 0-.676-.689A3.72 3.72 0 0 0 6.78 8.301Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.675 16.362a.47.47 0 0 0 0-.664L3.115.138a.47.47 0 1 0-.665.664l15.56 15.56a.47.47 0 0 0 .665 0Z"
      fill={color}
    />
  </Svg>
)

export default SvgComponent
