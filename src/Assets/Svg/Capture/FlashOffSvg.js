import { Colors, moderateScale } from '@/Theme'
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({ size = 24, color = Colors.black }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={moderateScale(size)}
    height={moderateScale(size)}
    xmlSpace="preserve"
  >
    <Path
      fill={color}
      d="M97.641 261.883a32.005 32.005 0 0 0 4.406 28.828A31.998 31.998 0 0 0 128 304h74.703l-26.328 171.133c-2.266 14.75 5.953 29.117 19.828 34.617a32.035 32.035 0 0 0 38.172-11.617l85.039-123.695-215.156-132.407-6.617 19.852zM480.766 324.75l-89.375-55 18.984-27.617a32.008 32.008 0 0 0 1.953-33.031A32.021 32.021 0 0 0 384 192h-60.219l72.844-145.688a32.022 32.022 0 0 0-1.406-31.133A31.985 31.985 0 0 0 368 0H208c-13.781 0-26 8.813-30.359 21.883l-32.172 96.527-80.703-49.66c-15.047-9.281-34.75-4.57-44.016 10.477-9.266 15.055-4.578 34.766 10.484 44.023l416 256a31.805 31.805 0 0 0 16.734 4.758c10.75 0 21.234-5.414 27.281-15.234 9.267-15.055 4.579-34.766-10.483-44.024z"
    />
  </Svg>
)

export default SvgComponent
