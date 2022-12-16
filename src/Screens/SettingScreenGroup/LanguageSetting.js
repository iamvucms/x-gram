import { CheckSvg } from '@/Assets/Svg'
import { AppBar, AppText, Box, Container, Obx, Row } from '@/Components'
import { appStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'

const LanguageSetting = () => {
  const { t } = useTranslation()
  const renderLangItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => appStore.setLanguage(item.code)}
        style={styles.langBtn}
      >
        <Row>
          <FastImage source={item.flag} style={styles.flag} />
          <AppText fontWeight={500}>{item.name}</AppText>
        </Row>
        <Obx>
          {() => (
            <Box
              size={16}
              radius={99}
              backgroundColor={item.isSelected ? Colors.primary : Colors.white}
              center
            >
              <CheckSvg color={Colors.white} size={12} />
            </Box>
          )}
        </Obx>
      </TouchableOpacity>
    )
  }, [])
  return (
    <Container style={styles.rootView}>
      <AppBar title={t('setting.language')} />
      <Box fill>
        <Obx>
          {() => (
            <FlatList
              data={appStore.languagues.slice()}
              renderItem={renderLangItem}
              keyExtractor={item => item?.code}
            />
          )}
        </Obx>
      </Box>
    </Container>
  )
}

export default LanguageSetting

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
})
