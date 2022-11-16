import { ChevronRightSvg } from '@/Assets/Svg'
import {
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { mockUsers } from '@/Models'
import { goBack } from '@/Navigators'
import { chatStore } from '@/Stores'
import { Colors, XStyleSheet } from '@/Theme'
import { autorun, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, TouchableOpacity } from 'react-native'

const CreateConversationScreen = () => {
  const { t } = useTranslation()
  const state = useLocalObservable(() => ({
    recommendUsers: mockUsers,
    results: mockUsers,
    search: '',
    setRecommentUsers: users => (state.recommendUsers = users),
    setResults: results => (state.results = results),
    setSearch: search => (state.search = search),
    get sections() {
      return [
        {
          title: t('results'),
          data: this.results,
        },
        {
          title: t('recommended'),
          data: this.recommendUsers,
        },
      ]
    },
  }))
  useEffect(() => {
    const dipose = autorun(() => {
      state.setRecommentUsers(toJS(chatStore.conversations).map(c => c.user))
    })
    return () => dipose()
  }, [])
  const renderSectionHeader = useCallback(({ section }) => {
    return section.data.length === 0 ? null : (
      <Padding horizontal={16} vertical={12}>
        <AppText fontWeight={700} fontSize={16}>
          {section.title}
        </AppText>
      </Padding>
    )
  }, [])
  const renderUserItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity style={styles.userBtn}>
        <AppImage
          source={{
            uri: item.avatar_url,
          }}
          containerStyle={styles.avatar}
        />
        <Box>
          <AppText>{item.full_name}</AppText>
          <AppText>{item.user_id}</AppText>
        </Box>
      </TouchableOpacity>
    )
  }, [])
  return (
    <Container>
      <Box
        row
        paddingVertical={12}
        paddingRight={16}
        align="center"
        justify="space-between"
      >
        <Row>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <ChevronRightSvg />
          </TouchableOpacity>
          <AppText lineHeightRatio={1.2} fontSize={24} fontWeight={800}>
            {t('conversations.new_conversation')}
          </AppText>
        </Row>
      </Box>
      <Box marginHorizontal={16} row align="center">
        <Box
          paddingHorizontal={12}
          height={40}
          radius={99}
          backgroundColor={Colors.border}
          marginRight={12}
          center
        >
          <AppText>{t('conversations.to')}</AppText>
        </Box>
        <AppInput
          style={styles.searchInput}
          placeholder={t('conversations.user_name_placeholder')}
        />
      </Box>
      <Obx>
        {() => (
          <SectionList
            sections={state.sections.slice()}
            keyExtractor={item => item.user_id}
            renderItem={renderUserItem}
            renderSectionHeader={renderSectionHeader}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Obx>
    </Container>
  )
}

export default CreateConversationScreen

const styles = XStyleSheet.create({
  backBtn: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.border,
    borderRadius: 99,
    paddingHorizontal: 12,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
  },
  userBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})
