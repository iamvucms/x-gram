import { Colors } from '@/Theme'
import MaskedView from '@react-native-masked-view/masked-view'
import React, { memo } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import AppText, { AppTextProps } from './AppText'
interface AppGradientTextProps extends AppTextProps {
  locations?: number[]
  colors?: string[]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  children: string
}
const AppGradientText = ({
  locations,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  style,
  children,
  ...restProps
}: AppGradientTextProps) => {
  return (
    <MaskedView
      style={{ alignSelf: 'flex-start' }}
      androidRenderingMode="software"
      maskElement={
        <AppText
          {...restProps}
          style={[
            style,
            {
              color: Colors.black,
            },
          ]}
        >
          {children}
        </AppText>
      }
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
      >
        <AppText {...restProps} style={[style, { opacity: 0 }]}>
          {children}
        </AppText>
      </LinearGradient>
    </MaskedView>
  )
}

export default memo(AppGradientText)
