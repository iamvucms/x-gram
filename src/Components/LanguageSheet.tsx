import { CheckSvg } from '@/Assets/Svg'
import { appStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { autorun } from 'mobx'
import React, { memo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, TouchableOpacity } from 'react-native'
import { AppBottomSheet, AppText, Obx, Padding } from '.'
import Row from './Row'

const LanguageSheet = () => {
  const sheetRef = useRef<any>()
  const { t } = useTranslation()
  useEffect(() => {
    const dipose = autorun(() => {
      if (appStore.showLanguageSheet) {
        sheetRef.current?.snapTo(0)
      } else {
        sheetRef.current?.close()
      }
    })
    return () => dipose()
  }, [])
  const renderLangItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          appStore.setLanguage(item?.code)
          appStore.setShowLanguageSheet(false)
        }}
        style={styles.langItem}
      >
        <Row>
          <Image source={item.flag} style={styles.flag} />
          <Obx>
            {() => (
              <AppText fontWeight={item.isSelected ? 700 : 400}>
                {item.name}
              </AppText>
            )}
          </Obx>
        </Row>
        <Obx>
          {() => (
            <CheckSvg
              size={16}
              color={item.isSelected ? Colors.k5BB318 : Colors.gray}
            />
          )}
        </Obx>
      </TouchableOpacity>
    )
  }
  return (
    <AppBottomSheet snapPoints={['20%']} ref={sheetRef}>
      <Padding horizontal={16}>
        <AppText fontSize={18} lineHeight={24} fontWeight={700}>
          {t('choose_language')}
        </AppText>
      </Padding>
      <Obx>
        {() => (
          <BottomSheetFlatList
            data={appStore.languagues.slice()}
            renderItem={renderLangItem}
            keyExtractor={(_, index) => `${index}`}
          />
        )}
      </Obx>
    </AppBottomSheet>
  )
}

export default memo(LanguageSheet)

const styles = XStyleSheet.create({
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.8,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
  },
})
