import { Colors } from '@/Theme'
import MaskedView from '@react-native-masked-view/masked-view'
import React, { memo } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import AppInput, { AppInputProps } from './AppInput'
import AppText, { AppTextProps } from './AppText'
interface AppGradientTextProps extends AppTextProps, AppInputProps {
  locations?: number[]
  colors?: string[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  children: string
  isInput?: boolean
}
const AppGradientText = ({
  locations,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  style,
  children,
  isInput = false,
  ...restProps
}: AppGradientTextProps) => {
  const TextComponent = isInput ? AppInput : AppText
  return (
    <MaskedView
      androidRenderingMode="software"
      maskElement={
        <TextComponent
          {...restProps}
          style={[
            style,
            {
              color: Colors.black,
            },
          ]}
        >
          {children}
        </TextComponent>
      }
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
      >
        <TextComponent {...restProps} style={[style, { opacity: 0 }]}>
          {children}
        </TextComponent>
      </LinearGradient>
    </MaskedView>
  )
}

export default memo(AppGradientText)
