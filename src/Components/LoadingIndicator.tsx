import { Colors, XStyleSheet } from '@/Theme'
import { Portal } from '@gorhom/portal'
import React, { memo } from 'react'
import { ActivityIndicator, Modal, Pressable, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import Spinkit, { SpinnerType } from 'react-native-spinkit'

interface LoadingIndicatorProps {
  overlayVisible?: boolean
  type?: 'default' | SpinnerType
  color?: string
  size?: number
  overlay?: boolean
  overlayColor?: string
  onRequestClose?: () => void
  backdropPressToClose?: boolean
}
const LoadingIndicator = ({
  overlayVisible,
  type = '9CubeGrid',
  color = Colors.primary,
  size = 20,
  overlay,
  overlayColor = Colors.black50,
  onRequestClose,
  backdropPressToClose,
}: LoadingIndicatorProps) => {
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'default':
        return <ActivityIndicator size={size} color={color} />
      default:
        return <Spinkit type={type} size={size} color={color} />
    }
  }
  const Container = overlay ? Portal : View
  return (
    <Container>
      {overlay
        ? overlayVisible && (
            <Animated.View
              entering={FadeIn}
              style={XStyleSheet.absoluteFillObject}
            >
              <Pressable
                disabled={!backdropPressToClose}
                onPress={onRequestClose}
                style={[
                  overlay && {
                    ...styles.overlayView,
                    backgroundColor: overlayColor,
                  },
                ]}
              >
                {renderLoadingIndicator()}
              </Pressable>
            </Animated.View>
          )
        : renderLoadingIndicator()}
    </Container>
  )
}

export default memo(LoadingIndicator)

const styles = XStyleSheet.create({
  overlayView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
})
