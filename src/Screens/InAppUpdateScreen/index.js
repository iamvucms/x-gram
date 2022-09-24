import { XStyleSheet } from '@/Theme'
import { useLocalObservable } from 'mobx-react-lite'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import CodePush from 'react-native-code-push'
import Animated, { FadeIn } from 'react-native-reanimated'
const DownloadType = {
  Intro: 1,
  Prepare: 2,
  Download: 3,
  Success: 4,
  Failed: 5,
}
const InAppUpdateScreen = () => {
  const state = useLocalObservable(() => ({
    type: DownloadType.Intro,
    setType: payload => (state.type = payload),
    totalSize: 0,
    setTotalSize: payload => (state.totalSize = payload),
    currentSize: 0,
    setCurrentSize: payload => (state.currentSize = payload),
  }))
  const { t } = useTranslation()
  const codePushStatusDidChange = syncStatus => {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        state.setType(DownloadType.Intro)
        break
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        break
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        break
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        state.setType(DownloadType.Success)
        break
      case CodePush.SyncStatus.UP_TO_DATE:
        state.setType(DownloadType.Success)
        break
      case CodePush.SyncStatus.UPDATE_IGNORED:
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        state.setType(DownloadType.Failed)
        break
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        CodePush.restartApp()
        break
      default:
        break
    }
  }
  const codePushDownloadDidProgress = progress => {
    state.setType(DownloadType.Download)
    state.setTotalSize(progress.totalBytes)
    state.setCurrentSize(progress.receivedBytes)
  }
  const immediateUpdate = () => {
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
      },
      codePushStatusDidChange,
      codePushDownloadDidProgress,
    )
  }

  return (
    <Animated.View entering={FadeIn} style={styles.containView}></Animated.View>
  )
}
const styles = XStyleSheet.create({
  containView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
    alignItems: 'center',
  },
})
const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: null,
}
export default CodePush(codePushOptions)(InAppUpdateScreen)
