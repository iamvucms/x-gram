import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { memo } from 'react'
import { Colors, moderateScale } from '@/Theme'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 287.32 287.32"
    xmlSpace="preserve"
    width={moderateScale(size)}
    height={moderateScale(size)}
  >
    <Path
      fill={color}
      d="M267.749 191.076c-14.595-11.729-27.983-17.431-40.93-17.431-18.729 0-32.214 11.914-44.423 24.119-1.404 1.405-3.104 2.06-5.349 2.06-10.288.001-28.387-12.883-53.794-38.293-29.89-29.892-41.191-48.904-33.592-56.506 20.6-20.593 27.031-41.237-4.509-80.462C73.861 10.51 62.814 3.68 51.38 3.68c-15.42 0-27.142 12.326-37.484 23.202-1.788 1.88-3.477 3.656-5.133 5.312-11.689 11.688-11.683 37.182.017 68.2 12.837 34.033 38.183 71.055 71.37 104.247 25.665 25.663 53.59 46.403 80.758 60.328 23.719 12.158 46.726 18.672 64.783 18.672h.007c11.3 0 20.479-2.465 26.541-7.478 12.314-10.181 35.234-29.039 35.081-51.439-.084-12.014-6.667-23.273-19.571-33.648z"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo
