import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.error }) => (
  <Svg
    width={moderateScale(size)}
    height={moderateScale(size)}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fill={color}
      d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z"
    />
  </Svg>
)

export default SvgComponent
