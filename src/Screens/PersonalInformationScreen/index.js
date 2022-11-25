import { ArrowRightSvg } from '@/Assets/Svg'
import { AppText, Box, Container } from '@/Components'
import { Colors } from '@/Theme'
import { getHitSlop } from '@/Utils'
import { TouchableOpacity, useBottomSheet } from '@gorhom/bottom-sheet'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

const PersonalInformationScreen = ({ navigation }) => {
  const { t } = useTranslation()
  const bottomSheet = useBottomSheet()
  const onSavePress = useCallback(() => {}, [])
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
            }
          }}
          style={[styles.headerBtn, styles.backBtn]}
        >
          <ArrowRightSvg size={18} />
        </TouchableOpacity>
        <AppText fontSize={16} fontWeight={600}>
          {t('profile.edit_personal_info')}
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
      <Box fill></Box>
    </Container>
  )
}

export default PersonalInformationScreen

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
})
