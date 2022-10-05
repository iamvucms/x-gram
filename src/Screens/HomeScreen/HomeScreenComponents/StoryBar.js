import {
  BellSvg,
  CreateStorySvg,
  MenuSvg,
  MessageSvg,
  StoryGradientBorderSvg,
} from '@/Assets/Svg'
import { AppImage, AppText, Box, Padding } from '@/Components'
import { Colors, XStyleSheet } from '@/Theme'
import { isAndroid } from '@/Utils'
import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import Animated, { ZoomIn } from 'react-native-reanimated'

const StoryBar = ({ stories = [] }) => {
  const { t } = useTranslation()
  const CreateButton = useMemo(() => {
    return (
      <View style={styles.createBtn}>
        <Animated.View key={Math.random()} entering={ZoomIn}>
          <TouchableOpacity>
            <CreateStorySvg size={84} />
          </TouchableOpacity>
        </Animated.View>
        <Padding top={7} />
        <AppText color={Colors.white}>{t('home.create_story')}</AppText>
      </View>
    )
  }, [])
  const renderStoryItem = useCallback(({ item, index }) => (
    <Pressable>
      <Animated.View
        key={Math.random()}
        entering={ZoomIn.delay((index + 1) * 200)}
        style={styles.storyAvatarView}
      >
        <StoryGradientBorderSvg size={84} />
        <AppImage
          containerStyle={styles.avatarImg}
          source={{ uri: 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' }}
        />
      </Animated.View>
      <Padding top={7} />
      <AppText align="center" color={Colors.white}>
        VuCms
      </AppText>
    </Pressable>
  ))
  return (
    <View style={styles.rootView}>
      <Box
        row
        justify="space-between"
        align="center"
        paddingTop={isAndroid ? 15 : 0}
        paddingHorizontal={20}
        marginBottom={24}
      >
        <TouchableOpacity>
          <MenuSvg color={Colors.white} />
        </TouchableOpacity>
        <Box
          row
          align="center"
          padding={3}
          backgroundColor={Colors.white006}
          radius={999}
        >
          <TouchableOpacity style={styles.headerBtn}>
            <BellSvg color={Colors.k8E8E8E} size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.headerBtn, { backgroundColor: Colors.white }]}
          >
            <MessageSvg color={Colors.k8E8E8E} size={25} />
          </TouchableOpacity>
        </Box>
      </Box>
      <FlatList
        data={new Array(10).fill(0)}
        ListHeaderComponent={CreateButton}
        horizontal
        renderItem={renderStoryItem}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Padding left={20} />}
        ListFooterComponent={<Padding right={20} />}
      />
    </View>
  )
}

export default memo(StoryBar)

const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.k222222,
    paddingBottom: 40,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
  },
  headerBtn: {
    width: 73,
    height: 49,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  storyAvatarView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    height: 68,
    width: 68,
    position: 'absolute',
    borderRadius: 28,
    zIndex: 99,
    overflow: 'hidden',
  },
})
