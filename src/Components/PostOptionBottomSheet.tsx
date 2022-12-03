import { screenHeight, XStyleSheet } from '@/Theme'
import { isIOS } from '@/Utils'
import React, { forwardRef, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { KeyboardSpacer } from '.'
import AppBottomSheet from './AppBottomSheet'
import Box from './Box'

interface PostOptionBottomSheetProps {
  index: number
  onClose: () => void
}
const PostOptionBottomSheet = forwardRef(
  ({ onClose, index = 0 }: PostOptionBottomSheetProps, ref) => {
    const { t } = useTranslation()

    const _onClose = useCallback(() => {
      Keyboard.dismiss()
      onClose && onClose()
    }, [])
    return (
      <AppBottomSheet
        onClose={_onClose}
        index={index}
        snapPoints={[screenHeight - 100]}
        ref={ref}
      >
        <Box fill></Box>
        {isIOS && <KeyboardSpacer />}
      </AppBottomSheet>
    )
  },
)

export default memo(PostOptionBottomSheet)

const styles = XStyleSheet.create({})
