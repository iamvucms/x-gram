import { SearchSvg } from '@/Assets/Svg'
import {
  AppBar,
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  KeyboardSpacer,
  Obx,
  Padding,
} from '@/Components'
import { navigateToProfile } from '@/Navigators'
import { diaLogStore, userStore } from '@/Stores'
import {
  Colors,
  Layout,
  ResponsiveWidth,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { isIOS } from '@/Utils'
import { autorun, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
const indicatorWidth = ResponsiveWidth(30)
const minIndicatorX = (screenWidth / 2 - indicatorWidth) / 2
const maxIndicatorX = screenWidth / 2 + minIndicatorX
const Type = {
  FOLLOWINGS: 'followings',
  FOLLOWERS: 'followers',
}
const FollowScreen = ({ route }) => {
  const { isFollowers = false } = route?.params || {}
  const tabAnim = useSharedValue(isFollowers ? 1 : 0)
  const { t } = useTranslation()
  const listRef = useRef()
  const state = useLocalObservable(() => ({
    type: isFollowers ? Type.FOLLOWERS : Type.FOLLOWINGS,
    q: '',
    setType: type => (state.type = type),
    setQ: q => (state.q = q),
    get followers() {
      const followers = toJS(userStore.followers)
      return followers.filter(
        follower =>
          follower.full_name.toLowerCase().includes(state.q.toLowerCase()) ||
          follower.user_id.includes(state.q.toLowerCase()),
      )
    },
    get followings() {
      const followings = toJS(userStore.followings)
      return followings.filter(
        following =>
          following.full_name.toLowerCase().includes(state.q.toLowerCase()) ||
          following.user_id.includes(state.q.toLowerCase()),
      )
    },
  }))
  useEffect(() => {
    const dispose = autorun(() => {
      tabAnim.value = withTiming(state.type === Type.FOLLOWERS ? 1 : 0)
      listRef.current?.scrollTo({
        x: state.type === Type.FOLLOWERS ? screenWidth : 0,
        animated: true,
      })
    })
    return () => {
      dispose()
    }
  }, [])
  const onScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }) => {
      const nextIndex = Math.round(x / screenWidth)
      state.setType(nextIndex === 0 ? Type.FOLLOWINGS : Type.FOLLOWERS)
    },
    [],
  )
  const renderFollowingItem = useCallback(({ item }) => {
    const onOpenProfile = () => navigateToProfile(item.user_id)
    const onUnFollowPress = () => {
      diaLogStore.showDiaLog({
        title: t('follow.unFollowTitle'),
        message: t('follow.unFollowDesc'),
        dialogIcon: 'pack1_3',
        showCancelButton: true,
        onPress: () => userStore.unfollowUser(item),
      })
    }
    return (
      <TouchableOpacity onPress={onOpenProfile} style={styles.userItem}>
        <AppImage
          disabled
          source={{
            uri: item.avatar_url,
          }}
          style={styles.avatar}
        />
        <Box fill>
          <View flex={1}>
            <AppText fontWeight={500}>
              {item.full_name}{' '}
              <AppText
                color={Colors.placeholder}
                fontWeight={500}
                fontSize={10}
              >
                (@{item.user_id})
              </AppText>
            </AppText>
            <AppText numberOfLines={1} color={Colors.placeholder} fontSize={12}>
              {item.bio}
            </AppText>
          </View>
          <TouchableOpacity onPress={onUnFollowPress} style={styles.followBtn}>
            <AppText
              fontSize={12}
              numberOfLines={1}
              color={Colors.error}
              fontWeight={600}
            >
              {t('profile.unFollow')}
            </AppText>
          </TouchableOpacity>
        </Box>
      </TouchableOpacity>
    )
  }, [])
  const renderFollowerItem = useCallback(({ item }) => {
    const onOpenProfile = () => navigateToProfile(item.user_id)
    const onRemoveFollowerPress = () => {
      diaLogStore.showDiaLog({
        title: t('follow.removeFollowerTitle'),
        message: t('follow.removeFollowerDesc'),
        dialogIcon: 'pack1_3',
        showCancelButton: true,
        onPress: () => userStore.removeFollower(item),
      })
    }
    return (
      <TouchableOpacity onPress={onOpenProfile} style={styles.userItem}>
        <AppImage
          disabled
          source={{
            uri: item.avatar_url,
          }}
          style={styles.avatar}
        />
        <Box fill>
          <View flex={1}>
            <AppText fontWeight={500}>
              {item.full_name}{' '}
              <AppText
                color={Colors.placeholder}
                fontWeight={500}
                fontSize={10}
              >
                (@{item.user_id})
              </AppText>
            </AppText>
            <AppText numberOfLines={1} color={Colors.placeholder} fontSize={12}>
              {item.bio}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={onRemoveFollowerPress}
            style={styles.followBtn}
          >
            <AppText
              fontSize={12}
              numberOfLines={1}
              color={Colors.error}
              fontWeight={600}
            >
              {t('follow.remove_follower')}
            </AppText>
          </TouchableOpacity>
        </Box>
      </TouchableOpacity>
    )
  }, [])
  const tabStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          tabAnim.value,
          [0, 1],
          [minIndicatorX, maxIndicatorX],
        ),
      },
    ],
  }))
  return (
    <Container safeAreaColor={Colors.white}>
      <AppBar title={t('follow.title')} />
      <Box fill>
        <Box
          row
          height={44}
          margin={16}
          align="center"
          radius={8}
          backgroundColor={Colors.border}
          paddingHorizontal={12}
        >
          <SearchSvg color={Colors.placeholder} size={20} />
          <Padding left={4} />
          <Obx>
            {() => (
              <AppInput
                value={state.q}
                onChangeText={q => state.setQ(q)}
                height={44}
                fontWeight={500}
                placeholder={t('search.search_placeholder')}
                lineHeight={20}
                autoCorrect={false}
              />
            )}
          </Obx>
        </Box>
        <Box height={1} backgroundColor={Colors.border} />
        <Box row align="center">
          <TouchableOpacity
            onPress={() => state.setType(Type.FOLLOWINGS)}
            style={styles.tabBtn}
          >
            <Obx>
              {() => (
                <AppText
                  color={
                    state.type === Type.FOLLOWINGS
                      ? Colors.primary
                      : Colors.black
                  }
                  fontWeight={600}
                  lineHeight={20}
                >
                  {t('profile.followings')}
                </AppText>
              )}
            </Obx>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => state.setType(Type.FOLLOWERS)}
            style={styles.tabBtn}
          >
            <Obx>
              {() => (
                <AppText
                  color={
                    state.type === Type.FOLLOWERS
                      ? Colors.primary
                      : Colors.black
                  }
                  fontWeight={600}
                  lineHeight={20}
                >
                  {t('profile.followers')}
                </AppText>
              )}
            </Obx>
          </TouchableOpacity>
          <Animated.View style={[styles.tabIndicator, tabStyle]} />
        </Box>
        <Box fill>
          <ScrollView
            ref={listRef}
            style={Layout.fill}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={onScrollEnd}
          >
            <Obx>
              {() => (
                <FlatList
                  width={screenWidth}
                  data={state.followers.slice()}
                  keyExtractor={item => item.user_id}
                  renderItem={renderFollowingItem}
                />
              )}
            </Obx>
            <Obx>
              {() => (
                <FlatList
                  width={screenWidth}
                  data={state.followings.slice()}
                  keyExtractor={item => item.user_id}
                  renderItem={renderFollowerItem}
                />
              )}
            </Obx>
          </ScrollView>
        </Box>
      </Box>
      {isIOS && <KeyboardSpacer />}
    </Container>
  )
}

export default FollowScreen

const styles = XStyleSheet.create({
  tabBtn: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIndicator: {
    height: 3,
    width: 30,
    backgroundColor: Colors.primary,
    borderRadius: 99,
    position: 'absolute',
    top: 33,
    left: 0,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 8,
    backgroundColor: Colors.primary10,
    borderRadius: 12,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 99,
    overflow: 'hidden',
    backgroundColor: Colors.gray,
    marginRight: 12,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
