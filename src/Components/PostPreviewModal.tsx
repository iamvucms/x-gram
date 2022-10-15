import { XStyleSheet } from '@/Theme'
import { Portal } from '@gorhom/portal'
import { BlurView } from '@react-native-community/blur'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'
interface PostPreviewModalProps {
  x: number
  y: number
  width: number
  height: number
  post: any
  visible: boolean
}
const PostPreviewModal = ({
  x,
  y,
  height,
  post,
  width,
  visible,
}: PostPreviewModalProps) => {
  const anim = useSharedValue(0)
  useEffect(() => {
    if (visible) {
      anim.value = withTiming(1)
    }
  }, [visible])
  return (
    <Portal name="POST_PREVIEW">
      <View style={styles.modalView}>
        <BlurView style={styles.blurView} />
      </View>
    </Portal>
  )
}

export default PostPreviewModal

const styles = XStyleSheet.create({
  modalView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  blurView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
})
