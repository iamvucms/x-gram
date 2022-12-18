import { BackSpaceSvg, FingerPrintSvg } from '@/Assets/Svg'
import { KeyboardData } from '@/Models'
import { screenWidth, XStyleSheet } from '@/Theme'
import React, { memo, useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import AppText from './AppText'
interface KeyboardProps {
  disabledID?: boolean
  onPress: (value: string) => void
  onRequestBioMetric: () => void
  onDel: () => void
}
const Keyboard = ({
  disabledID,
  onPress,
  onRequestBioMetric,
  onDel,
}: KeyboardProps) => {
  const renderKeyboardItem = useCallback(item => {
    const _onPress = () => {
      if (item.value === 'finger_print') {
        onRequestBioMetric && onRequestBioMetric()
      } else if (item.value === 'backspace') {
        onDel && onDel()
      } else {
        onPress && onPress(item.value)
      }
    }
    const isHidden = disabledID && item.value === 'finger_print'
    return (
      <TouchableOpacity
        disabled={isHidden}
        key={item.value}
        onPress={_onPress}
        style={[styles.cell, isHidden && { opacity: 0 }]}
      >
        {item.value === 'finger_print' ? (
          <FingerPrintSvg size={40} />
        ) : item.value === 'backspace' ? (
          <BackSpaceSvg size={30} />
        ) : (
          <>
            <AppText fontSize="h1" lineHeightRatio={1.5}>
              {item.value}
            </AppText>
            <AppText fontSize={14}>{item.character || ' '}</AppText>
          </>
        )}
      </TouchableOpacity>
    )
  }, [])
  return (
    <View style={styles.rootView}>
      <View style={styles.keyboardView}>
        {KeyboardData.map(renderKeyboardItem)}
      </View>
    </View>
  )
}

export default memo(Keyboard)

const styles = XStyleSheet.create({
  rootView: {},
  keyboardView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  cell: {
    width: screenWidth / 3,
    aspectRatio: 1.2,
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
    skipResponsive: true,
  },
})
