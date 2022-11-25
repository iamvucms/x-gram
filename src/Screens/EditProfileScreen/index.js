import { ArrowRightSvg, ChevronRightSvg, CloseSvg } from '@/Assets/Svg'
import {
  AppButton,
  AppInput,
  AppText,
  Box,
  Container,
  ErrorLabel,
  Obx,
} from '@/Components'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { userStore } from '@/Stores'
import { Colors } from '@/Theme'
import {
  getHitSlop,
  validateBio,
  validateFullName,
  validateUserName,
  validateWebsite,
} from '@/Utils'
import {
  BottomSheetScrollView,
  TouchableOpacity,
  useBottomSheet,
} from '@gorhom/bottom-sheet'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

const EditProfileScreen = ({ navigation }) => {
  const { t } = useTranslation()
  const bottomSheet = useBottomSheet()
  const onSavePress = useCallback(() => {}, [])
  const state = useLocalObservable(() => ({
    fullName: userStore.userInfo.full_name,
    userId: userStore.userInfo.user_id,
    bio: userStore.userInfo.bio,
    website: '',
    websites: userStore.userInfo.websites || [],
    errorFullName: '',
    errorBio: '',
    errorWebsite: '',
    errorUserId: '',
    setFullName: value => (state.fullName = value),
    setBio: value => (state.bio = value),
    setWebsite: value => (state.website = value),
    setUserId: value => (state.userId = value),
    setErrorFullName: value => (state.errorFullName = value),
    setErrorBio: value => (state.errorBio = value),
    setErrorWebsite: value => (state.errorWebsite = value),
    setErrorUserId: value => (state.errorUserId = value),
    setWebsites: value => (state.websites = value),
    addWebsite: () => {
      if (
        state.website &&
        !state.websites.some(item => item === state.website)
      ) {
        state.websites.push(state.website)
        state.setWebsite('')
      }
    },
    removeWebsite: website => {
      state.websites = state.websites.filter(item => item !== website)
    },
    reset() {
      state.setFullName(userStore.userInfo.full_name)
      state.setBio(userStore.userInfo.bio)
      state.setWebsite('')
      state.setWebsites(userStore.userInfo.websites || [])
      state.setErrorFullName('')
      state.setErrorBio('')
      state.setErrorWebsite('')
      state.setErrorUserId('')
    },
    get isValid() {
      return (
        state.errorFullName === '' &&
        state.errorBio === '' &&
        state.errorWebsite === '' &&
        state.errorUserId === '' &&
        state.fullName !== '' &&
        state.bio !== '' &&
        state.website !== '' &&
        state.userId !== '' &&
        state.userId !== userStore.userInfo.user_id &&
        state.fullName !== userStore.userInfo.full_name &&
        state.bio !== userStore.userInfo.bio &&
        state.website !== userStore.userInfo.website
      )
    },
  }))
  const renderWebsiteItem = useCallback(site => {
    return (
      <TouchableOpacity
        onPress={() => state.removeWebsite(site)}
        key={site}
        style={styles.siteBtn}
      >
        <AppText
          lineHeight={12}
          fontSize={12}
          fontWeight={700}
          color={Colors.primary}
        >
          {site.replace('https://', '').replace('http://', '')}
        </AppText>
        <Box
          marginLeft={8}
          size={16}
          center
          radius={99}
          backgroundColor={Colors.black50}
        >
          <CloseSvg color={Colors.white} size={10} />
        </Box>
      </TouchableOpacity>
    )
  }, [])
  return (
    <Container
      disableTop
      containerStyle={{ backgroundColor: Colors.transparent }}
      style={styles.rootView}
    >
      <Box
        row
        justify="space-between"
        align="center"
        height={50}
        borderBottomColor={Colors.border}
        borderBottomWidth={0.3}
      >
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack()
            } else {
              bottomSheet.close()
              state.reset()
            }
          }}
          style={[styles.headerBtn, styles.backBtn]}
        >
          <ArrowRightSvg size={18} />
        </TouchableOpacity>
        <AppText fontSize={16} fontWeight={600}>
          {t('profile.edit_profile')}
        </AppText>
        <TouchableOpacity
          hitSlop={getHitSlop(10)}
          onPress={onSavePress}
          style={[styles.headerBtn, styles.saveBtn]}
        >
          <AppText color={Colors.primary} fontWeight={500}>
            {t('save')}
          </AppText>
        </TouchableOpacity>
      </Box>
      <BottomSheetScrollView>
        <Box margin={16}>
          <FastImage
            source={{
              uri: userStore.userInfo.cover_url,
            }}
            style={styles.coverImage}
          />
          <FastImage
            source={{
              uri: userStore.userInfo.avatar_url,
            }}
            style={styles.avatarImage}
          />
        </Box>
        <Box marginHorizontal={16} marginBottom={16}>
          <AppText fontSize={12} fontWeight={700} color={Colors.placeholder}>
            {t('profile.full_name')}
          </AppText>
          <View style={styles.inputView}>
            <Obx>
              {() => (
                <AppInput
                  fontWeight={500}
                  value={state.fullName}
                  onChangeText={txt => {
                    state.setFullName(txt)
                    state.setErrorFullName(validateFullName(txt))
                  }}
                  placeholder={t('auth.fullname_placeholder')}
                  placeholderTextColor={Colors.placeholder}
                />
              )}
            </Obx>
          </View>
          <Obx>
            {() =>
              state.errorFullName && <ErrorLabel text={state.errorFullName} />
            }
          </Obx>
        </Box>
        <Box marginHorizontal={16} marginBottom={16}>
          <AppText fontSize={12} fontWeight={700} color={Colors.placeholder}>
            {t('profile.username')}
          </AppText>
          <View style={styles.inputView}>
            <Obx>
              {() => (
                <AppInput
                  fontWeight={500}
                  value={state.userId}
                  onChangeText={txt => {
                    state.setUserId(txt)
                    state.setErrorUserId(validateUserName(txt))
                  }}
                  placeholder={t('auth.user_name_placeholder')}
                  placeholderTextColor={Colors.placeholder}
                />
              )}
            </Obx>
          </View>
          <Obx>
            {() => state.errorUserId && <ErrorLabel text={state.errorUserId} />}
          </Obx>
        </Box>
        <Box marginHorizontal={16} marginBottom={16}>
          <AppText fontSize={12} fontWeight={700} color={Colors.placeholder}>
            {t('profile.bio')}
          </AppText>
          <View style={styles.inputView}>
            <Obx>
              {() => (
                <AppInput
                  fontWeight={500}
                  value={state.bio}
                  onChangeText={txt => {
                    state.setBio(txt)
                    state.setErrorBio(validateBio(txt))
                  }}
                  placeholder={t('auth.bio_placeholder')}
                  placeholderTextColor={Colors.placeholder}
                />
              )}
            </Obx>
          </View>
          <Obx>
            {() => state.errorBio && <ErrorLabel text={state.errorBio} />}
          </Obx>
        </Box>
        <Box marginHorizontal={16} marginBottom={16}>
          <AppText fontSize={12} fontWeight={700} color={Colors.placeholder}>
            {t('profile.website')}
          </AppText>
          <Box
            marginTop={8}
            marginBottom={4}
            marginHorizontal={-4}
            row
            flexWrap="wrap"
            align="center"
          >
            <Obx>{() => state.websites.map(renderWebsiteItem)}</Obx>
          </Box>
          <View style={styles.inputView}>
            <Obx>
              {() => (
                <AppInput
                  fontWeight={500}
                  value={state.website}
                  onChangeText={txt => {
                    state.setWebsite(txt)
                    state.setErrorWebsite(validateWebsite(txt))
                  }}
                  placeholder={t('auth.website_placeholder')}
                  placeholderTextColor={Colors.placeholder}
                />
              )}
            </Obx>
          </View>
          <Obx>
            {() =>
              state.errorWebsite && <ErrorLabel text={state.errorWebsite} />
            }
          </Obx>
        </Box>
        <AppButton
          onPress={() =>
            navigation.navigate(PageName.PersonalInformationScreen)
          }
          text={t('profile.edit_personal_info')}
          backgroundColor={Colors.white}
          radius={0}
          spaceBetween
          textColor={Colors.primary}
          svgIcon={<ChevronRightSvg color={Colors.primary} />}
        />
        <AppButton
          onPress={() => {
            bottomSheet.close()
            navigate(PageName.SettingScreen)
          }}
          text={t('profile.setting')}
          backgroundColor={Colors.white}
          radius={0}
          spaceBetween
          textColor={Colors.primary}
          svgIcon={<ChevronRightSvg color={Colors.primary} />}
        />
        <Box height={300} />
      </BottomSheetScrollView>
    </Container>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  rootView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    flex: 1,
  },
  headerBtn: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  backBtn: {
    transform: [{ rotate: '180deg' }],
    marginRight: 16,
  },
  saveBtn: {
    marginRight: 16,
  },
  coverImage: {
    height: 180,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: Colors.white,
    alignSelf: 'center',
    marginTop: -50,
    backgroundColor: Colors.border,
  },
  inputView: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  siteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    marginHorizontal: 4,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
