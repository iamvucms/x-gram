/* eslint-disable react-native/no-inline-styles */
import {
  ChevronRightSvg,
  EditSvg,
  InfoCircleSvg,
  LockSvg,
  PaperSvg,
} from '@/Assets/Svg'
import {
  AppBar,
  AppBottomSheet,
  AppInput,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { FeedBackLevel } from '@/Models'
import { Colors, ResponsiveHeight, XStyleSheet } from '@/Theme'
import { getHitSlop } from '@/Utils'
import { toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableOpacity } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const FeedBackEmojies = ['😩', '🙁', '😐', '☺️', '😁']
const TermConditionSetting = () => {
  const { t } = useTranslation()
  const feedbackRef = useRef()
  const state = useLocalObservable(() => ({
    feedback: '',
    feebackType: FeedBackLevel.Normal,
    setFeedBack: feedback => (state.feedback = feedback),
    setFeedBackType: type => (state.feebackType = type),
    get isValidFeedback() {
      return state.feedback.length > 0
    },
  }))
  const renderEmojiItem = useCallback((item, index) => {
    return (
      <Obx>
        {() => {
          const isSelected =
            Object.values(FeedBackLevel)[index] === state.feebackType
          return (
            <TouchableOpacity
              onPress={() => {
                state.setFeedBackType(Object.values(FeedBackLevel)[index])
              }}
              key={item}
              style={[
                styles.emojiBtn,
                isSelected && { borderColor: Colors.primary },
              ]}
            >
              <AppText lineHeight={28} fontSize={24}>
                {item}
              </AppText>
            </TouchableOpacity>
          )
        }}
      </Obx>
    )
  }, [])
  const onFeedbackPress = useCallback(() => {
    const feedback = toJS(state.feedback)
    const feebackType = toJS(state.feebackType)
    //TODO: call api
    state.setFeedBack('')
    state.setFeedBackType(FeedBackLevel.Normal)
    feedbackRef.current?.close?.()
  }, [])
  const { bottom } = useSafeAreaInsets()
  return (
    <Container safeAreaColor={Colors.white}>
      <Box backgroundColor={Colors.white}>
        <AppBar title={t('setting.term_and_conditions')} />
      </Box>
      <Box fill padding={16}>
        <TouchableOpacity
          onPress={() => InAppBrowser.open('https://xgram.app/privacy-policy')}
          style={styles.subSettingView}
        >
          <Row>
            <Box size={44} center>
              <LockSvg size={20} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.privacy_policy')}
            </AppText>
          </Row>
          <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            InAppBrowser.open('https://xgram.app/terms-of-service')
          }
          style={styles.subSettingView}
        >
          <Row>
            <Box size={44} center>
              <PaperSvg size={20} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.terms_of_service')}
            </AppText>
          </Row>
          <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => InAppBrowser.open('https://xgram.app/about-us')}
          style={styles.subSettingView}
        >
          <Row>
            <Box size={44} center>
              <InfoCircleSvg size={20} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.about_us')}
            </AppText>
          </Row>
          <ChevronRightSvg color={Colors.k8E8E8E} size={12} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => feedbackRef.current?.snapTo?.(0)}
          style={styles.subSettingView}
        >
          <Row>
            <Box size={44} center>
              <EditSvg size={20} />
            </Box>
            <AppText fontSize={16} fontWeight={500}>
              {t('setting.feed_back')}
            </AppText>
          </Row>
        </TouchableOpacity>
      </Box>
      <AppBottomSheet
        ref={feedbackRef}
        snapPoints={[ResponsiveHeight(350)]}
        backgroundStyle={{ opacity: 0 }}
        handleIndicatorStyle={{ backgroundColor: Colors.white50 }}
        onClose={() => Keyboard.dismiss()}
      >
        <Box
          fill
          paddingBottom={bottom || 16}
          paddingTop={20}
          backgroundColor={Colors.white}
          topLeftRadius={16}
          topRightRadius={16}
        >
          <Padding horizontal={50}>
            <AppText
              fontWeight={700}
              align="center"
              fontSize={24}
              color={Colors.blueblack}
            >
              {t('setting.feed_back_note')}!
            </AppText>
          </Padding>
          <Box
            marginTop={12}
            paddingVertical={3}
            paddingHorizontal={12}
            radius={6}
            backgroundColor={Colors.primary10}
            alignSelf="center"
          >
            <AppText fontSize={12} fontWeight={700} color={Colors.primary}>
              <Obx>
                {() =>
                  t(
                    'setting.feed_back_emotion_' +
                      (Object.values(FeedBackLevel).indexOf(state.feebackType) +
                        1),
                  )
                }
              </Obx>
              !
            </AppText>
          </Box>
          <Box
            marginTop={16}
            paddingHorizontal={16}
            row
            align="center"
            justify="space-between"
          >
            {FeedBackEmojies.map(renderEmojiItem)}
          </Box>
          <Box
            radius={12}
            margin={16}
            padding={10}
            backgroundColor={Colors.primary10}
            fill
          >
            <Obx>
              {() => (
                <AppInput
                  multiline
                  placeholder={t('setting.feedback_placeholder')}
                  placeholderTextColor={Colors.placeholder}
                  color={Colors.blueblack}
                  fontWeight={500}
                  autoCorrect={false}
                  value={state.feedback}
                  onChangeText={txt => state.setFeedBack(txt)}
                />
              )}
            </Obx>
          </Box>
          <Box
            row
            align="center"
            justify="space-between"
            paddingHorizontal={16}
          >
            <TouchableOpacity
              onPress={() => feedbackRef.current?.close?.()}
              hitSlop={getHitSlop(16)}
            >
              <AppText fontWeight={700} color={Colors.gray}>
                {t('close')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onFeedbackPress}
              hitSlop={getHitSlop(16)}
            >
              <AppText fontWeight={700} color={Colors.primary}>
                {t('setting.send_feedback')}
              </AppText>
            </TouchableOpacity>
          </Box>
        </Box>
      </AppBottomSheet>
    </Container>
  )
}

export default TermConditionSetting

const styles = XStyleSheet.create({
  subSettingView: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  emojiBtn: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: Colors.primary10,
    borderWidth: 1,
    borderColor: Colors.primary10,
  },
})
