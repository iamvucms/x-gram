import { formatCurrency } from '@/Utils'
import React, { useEffect, useRef } from 'react'
import { Animated, TextInput } from 'react-native'
import AppInput, { AppInputProps } from './AppInput'
interface AnimatedNumberProps extends Omit<AppInputProps, 'value'> {
  value: number
  duration?: number
  formatter?: (value: number) => string
}
const AnimatedNumber = ({
  value = 0,
  duration = 1000,
  formatter = formatCurrency,
  ...restProps
}: AnimatedNumberProps) => {
  const numberAnim = useRef(new Animated.Value(0)).current
  const inputRef = useRef<TextInput>()

  useEffect(() => {
    const listenerId = numberAnim.addListener(number => {
      inputRef.current?.setNativeProps?.({
        text: formatter(Math.round(number.value)),
      })
    })
    return () => numberAnim.removeListener(listenerId)
  }, [])

  useEffect(() => {
    Animated.timing(numberAnim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start()
  }, [value])

  return (
    <AppInput
      {...restProps}
      editable={false}
      scrollEnabled={false}
      ref={inputRef}
    />
  )
}

export default AnimatedNumber
