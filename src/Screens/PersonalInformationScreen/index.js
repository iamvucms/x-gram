import { ArrowRightSvg, ChevronRightSvg, InforSvg } from '@/Assets/Svg'
import {
  AppInput,
  AppText,
  Box,
  Container,
  ErrorLabel,
  Obx,
  Padding,
} from '@/Components'
import { Gender } from '@/Models'
import { userStore } from '@/Stores'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { getHitSlop, validateEmail, validateUserPhone } from '@/Utils'
import { useBottomSheet } from '@gorhom/bottom-sheet'
import { flowResult } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated'
const UpdateType = {
  EMAIL: 'email',
  PHONE: 'phone',
  GENDER: 'GENDER',
  DOB: 'dob',
}
const PersonalInformationScreen = ({ navigation }) => {
  const { t } = useTranslation()
  const bottomSheet = useBottomSheet()
  const state = useLocalObservable(() => ({
    type: null,
    email: userStore.userInfo.email,
    phoneNumber: userStore.userInfo.phone_number,
    gender: userStore.userInfo.gender,
    dob: userStore.userInfo.date_of_birth,
    errorEmail: '',
    errorPhoneNumber: '',
    errorGender: '',
    errorDob: '',
    setType: value => (state.type = value),
    setEmail: value => (state.email = value),
    setPhoneNumber: value => (state.phoneNumber = value),
    setGender: value => (state.gender = value),
    setDob: value => (state.dob = value),
    setErrorEmail: value => (state.errorEmail = value),
    setErrorPhoneNumber: value => (state.errorPhoneNumber = value),
    setErrorGender: value => (state.errorGender = value),
    setErrorDob: value => (state.errorDob = value),
    get isValidEmail() {
      return (
        state.email &&
        !state.errorEmail &&
        state.type === UpdateType.EMAIL &&
        state.email !== userStore.userInfo.email
      )
    },
    get isValidPhoneNumber() {
      return (
        state.phoneNumber &&
        !state.errorPhoneNumber &&
        state.type === UpdateType.PHONE &&
        state.phoneNumber !== userStore.userInfo.phone_number
      )
    },
    get isValidGender() {
      return (
        state.gender &&
        !state.errorGender &&
        state.type === UpdateType.GENDER &&
        state.gender !== userStore.userInfo.gender
      )
    },
    get isValidDob() {
      return (
        state.dob &&
        !state.errorDob &&
        state.type === UpdateType.DOB &&
        state.dob !== userStore.userInfo.date_of_birth
      )
    },
    get isValid() {
      return (
        state.isValidEmail ||
        state.isValidPhoneNumber ||
        state.isValidGender ||
        state.isValidDob
      )
    },
    get title() {
      switch (state.type) {
        case UpdateType.EMAIL:
          return t('profile.email_address')
        case UpdateType.PHONE:
          return t('profile.phone_number')
        case UpdateType.GENDER:
          return t('profile.gender')
        case UpdateType.DOB:
          return t('profile.date_of_birth')
        default:
          return t('profile.edit_personal_info')
      }
    },
  }))
  const onBackPress = useCallback(() => {
    if (!state.type) {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        bottomSheet.close()
      }
    } else {
      state.setType(null)
    }
  }, [])
  const onSavePress = useCallback(async () => {
    if (!state.isValid) {
      return
    }
    const updateData = {
      ...(state.type === UpdateType.EMAIL && { email: state.email }),
      ...(state.type === UpdateType.PHONE && {
        phone_number: state.phoneNumber,
      }),
      ...(state.type === UpdateType.GENDER && { gender: state.gender }),
      ...(state.type === UpdateType.DOB && { date_of_birth: state.dob }),
    }
    state.setType(null)
    await flowResult(userStore.updateUserInfo(updateData))
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
          onPress={onBackPress}
          style={[styles.headerBtn, styles.backBtn]}
        >
          <ArrowRightSvg size={18} />
        </TouchableOpacity>
        <AppText fontSize={16} fontWeight={600}>
          <Obx>{() => state.title}</Obx>
        </AppText>
        <Obx>
          {() => (
            <TouchableOpacity
              disabled={!state.isValid || !state.type}
              hitSlop={getHitSlop(10)}
              onPress={onSavePress}
              style={[
                styles.headerBtn,
                styles.saveBtn,
                // eslint-disable-next-line react-native/no-inline-styles
                !state.type && { opacity: 0 },
              ]}
            >
              <AppText
                color={state.isValid ? Colors.primary : Colors.gray}
                fontWeight={500}
              >
                {t('save')}
              </AppText>
            </TouchableOpacity>
          )}
        </Obx>
      </Box>
      <Obx>
        {() =>
          !state.type && (
            <Animated.View entering={FadeInLeft} style={Layout.fill}>
              <Box
                margin={16}
                padding={10}
                backgroundColor={Colors.primary25}
                radius={10}
                row
                align="center"
              >
                <InforSvg color={Colors.primary} />
                <Padding left={8} />
                <AppText color={Colors.primary} fontSize={12} fontWeight={600}>
                  {t('profile.update_personal_info_note')}
                </AppText>
              </Box>
              <TouchableOpacity
                onPress={() => state.setType(UpdateType.EMAIL)}
                style={styles.inforBtn}
              >
                <View>
                  <AppText
                    lineHeight={14}
                    fontSize={12}
                    fontWeight={700}
                    color={Colors.placeholder}
                  >
                    {t('profile.email_address')}
                  </AppText>
                  <AppText
                    fontWeight={600}
                    color={Colors.primary}
                    fontSize={12}
                  >
                    <Obx>{() => userStore.userInfo.email}</Obx>
                  </AppText>
                </View>
                <ChevronRightSvg color={Colors.primary} size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => state.setType(UpdateType.PHONE)}
                style={styles.inforBtn}
              >
                <View>
                  <AppText
                    lineHeight={14}
                    fontSize={12}
                    fontWeight={700}
                    color={Colors.placeholder}
                  >
                    {t('profile.phone_number')}
                  </AppText>
                  <AppText
                    fontWeight={600}
                    color={Colors.primary}
                    fontSize={12}
                  >
                    <Obx>{() => userStore.userInfo.phone_number}</Obx>
                  </AppText>
                </View>
                <ChevronRightSvg color={Colors.primary} size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => state.setType(UpdateType.GENDER)}
                style={styles.inforBtn}
              >
                <View>
                  <AppText
                    lineHeight={14}
                    fontSize={12}
                    fontWeight={700}
                    color={Colors.placeholder}
                  >
                    {t('profile.gender')}
                  </AppText>
                  <AppText
                    fontWeight={600}
                    color={Colors.primary}
                    fontSize={12}
                  >
                    <Obx>
                      {() =>
                        userStore.userInfo.gender === Gender.Female
                          ? t('profile.female')
                          : userStore.userInfo.gender === Gender.Male
                          ? t('profile.male')
                          : t('profile.prefer_not_to_say')
                      }
                    </Obx>
                  </AppText>
                </View>
                <ChevronRightSvg color={Colors.primary} size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => state.setType(UpdateType.DOB)}
                style={styles.inforBtn}
              >
                <View>
                  <AppText
                    lineHeight={14}
                    fontSize={12}
                    fontWeight={700}
                    color={Colors.placeholder}
                  >
                    {t('profile.date_of_birth')}
                  </AppText>
                  <AppText
                    fontWeight={600}
                    color={Colors.primary}
                    fontSize={12}
                  >
                    <Obx>{() => userStore.userInfo.date_of_birth}</Obx>
                  </AppText>
                </View>
                <ChevronRightSvg color={Colors.primary} size={16} />
              </TouchableOpacity>
            </Animated.View>
          )
        }
      </Obx>
      <Obx>
        {() =>
          state.type === UpdateType.EMAIL && (
            <Animated.View entering={FadeInRight} style={Layout.fill}>
              <Box margin={16}>
                <View style={styles.inputView}>
                  <Obx>
                    {() => (
                      <AppInput
                        autoFocus
                        fontWeight={500}
                        value={state.email}
                        onChangeText={txt => {
                          state.setEmail(txt)
                          state.setErrorEmail(validateEmail(txt))
                        }}
                        placeholder={t('auth.email_placeholder')}
                        placeholderTextColor={Colors.placeholder}
                      />
                    )}
                  </Obx>
                </View>
                <Obx>
                  {() =>
                    state.errorEmail && <ErrorLabel text={state.errorEmail} />
                  }
                </Obx>
              </Box>
            </Animated.View>
          )
        }
      </Obx>
      <Obx>
        {() =>
          state.type === UpdateType.PHONE && (
            <Animated.View entering={FadeInRight} style={Layout.fill}>
              <Box margin={16}>
                <View style={styles.inputView}>
                  <Obx>
                    {() => (
                      <AppInput
                        keyboardType="phone-pad"
                        autoFocus
                        fontWeight={500}
                        value={state.phoneNumber}
                        onChangeText={txt => {
                          state.setPhoneNumber(txt)
                          state.setErrorPhoneNumber(validateUserPhone(txt))
                        }}
                        placeholder={t('auth.phone_placeholder')}
                        placeholderTextColor={Colors.placeholder}
                      />
                    )}
                  </Obx>
                </View>
                <Obx>
                  {() =>
                    state.errorPhoneNumber && (
                      <ErrorLabel text={state.errorPhoneNumber} />
                    )
                  }
                </Obx>
              </Box>
            </Animated.View>
          )
        }
      </Obx>
      <Obx>
        {() =>
          state.type === UpdateType.GENDER && (
            <Animated.View entering={FadeInRight} style={Layout.fill}>
              <Box margin={16}>
                <TouchableOpacity
                  onPress={() => state.setGender(Gender.Male)}
                  style={styles.genderView}
                >
                  <View style={styles.radioView}>
                    <Obx>
                      {() =>
                        state.gender === Gender.Male && (
                          <View style={styles.genderActiveView} />
                        )
                      }
                    </Obx>
                  </View>
                  <AppText fontWeight={600} color={Colors.placeholder}>
                    {t('profile.male')}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => state.setGender(Gender.Female)}
                  style={styles.genderView}
                >
                  <View style={styles.radioView}>
                    <Obx>
                      {() =>
                        state.gender === Gender.Female && (
                          <View style={styles.genderActiveView} />
                        )
                      }
                    </Obx>
                  </View>
                  <AppText fontWeight={600} color={Colors.placeholder}>
                    {t('profile.female')}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => state.setGender(Gender.PreferNotToSay)}
                  style={styles.genderView}
                >
                  <View style={styles.radioView}>
                    <Obx>
                      {() =>
                        state.gender === Gender.PreferNotToSay && (
                          <View style={styles.genderActiveView} />
                        )
                      }
                    </Obx>
                  </View>
                  <AppText fontWeight={600} color={Colors.placeholder}>
                    {t('profile.prefer_not_to_say')}
                  </AppText>
                </TouchableOpacity>
              </Box>
            </Animated.View>
          )
        }
      </Obx>
    </Container>
  )
}

export default PersonalInformationScreen

const styles = XStyleSheet.create({
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
  inforBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 4,
    marginHorizontal: 16,
    borderBottomColor: Colors.primary25,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  inputView: {
    borderWidth: 1,
    borderColor: Colors.primary,
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  genderView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioView: {
    height: 24,
    width: 24,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderActiveView: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
})
