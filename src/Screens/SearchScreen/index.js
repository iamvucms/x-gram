import {
  ArrowRightSvg,
  FollowSvg,
  MultipleSvg,
  SearchSvg,
  UnfollowSvg,
  VideoSvg,
} from '@/Assets/Svg'
import {
  AppButton,
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  KeyboardSpacer,
  LoadingIndicator,
  Obx,
  Padding,
  Row,
} from '@/Components'
import { PageName } from '@/Config'
import {
  mockPosts,
  mockUsers,
  PeopleFilterType,
  PeopleFilterTypes,
  TagFilterTypes,
} from '@/Models'
import { navigate, navigateToProfile } from '@/Navigators'
import { searchPosts, searchUsers } from '@/Services/Api'
import { userStore } from '@/Stores'
import {
  Colors,
  Layout,
  ResponsiveHeight,
  ResponsiveWidth,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { isIOS } from '@/Utils'
import { MasonryFlashList } from '@shopify/flash-list'
import { autorun, toJS } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Pressable,
  ScrollView,
  View,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Video from 'react-native-video'
const SearchType = {
  POST: 'POST',
  PEOPLE: 'PEOPLE',
}
const SearchScreen = () => {
  const { t } = useTranslation()
  const filterRef = useRef()
  const listRef = useRef()
  const typeAnim = useSharedValue(0)
  const state = useLocalObservable(() => ({
    searchType: SearchType.POST,
    setSearchType: searchType => (state.searchType = searchType),
    type: null,
    setType: type => (state.type = type),
    posts: mockPosts,
    setPosts: posts => (state.posts = posts),
    users: mockUsers,
    setUsers: users => (state.users = users),
    page: 1,
    setPage: page => (state.page = page),
    userPage: 1,
    setUserPage: userPage => (state.userPage = userPage),
    q: '',
    setQ: q => (state.q = q),
    searching: false,
    setSearching: searching => (state.searching = searching),
    loadingMore: false,
    setLoadingMore: loadingMore => (state.loadingMore = loadingMore),
    loadingMoreUsers: false,
    setLoadingMoreUsers: loadingMoreUsers =>
      (state.loadingMoreUsers = loadingMoreUsers),
    loading: true,
    setLoading: loading => (state.loading = loading),
  }))
  const initSearchData = async () => {
    //TODO fetch default posts from server
    try {
      const response = await searchPosts('', '')
      if (response?.status === 'OK') {
        state.setPosts(response.data)
      }
    } catch (e) {
      //TODO handle error
      console.log({ initSearchData: e })
    }
    //TODO fetch default users from server
    try {
      const response = await searchUsers('')
      if (response?.status === 'OK') {
        state.setUsers(response.data)
      }
    } catch (e) {
      //TODO handle error
      console.log({ initSearchData: e })
    }
  }
  useEffect(() => {
    initSearchData()
    let to = null
    setTimeout(() => {
      state.setLoading(false)
    }, 350)
    const dispose = autorun(() => {
      clearTimeout(to)
      const q = state.q
      const tag = state.type || ''
      const searchType = state.searchType
      to = setTimeout(async () => {
        state.setSearching(true)
        if (searchType === SearchType.POST) {
          const response = await searchPosts(q, tag, state.page)
          if (response?.status === 'OK') {
            state.setPosts(response.data)
          } else {
            state.setPosts(mockPosts)
          }
        } else {
          if (tag === PeopleFilterType.All) {
            const response = await searchUsers(q)
            if (response?.status === 'OK') {
              state.setUsers(response.data)
            } else {
              state.setUsers(mockUsers)
            }
          } else {
            if (tag === PeopleFilterType.Following) {
              state.setUsers(toJS(userStore.followings))
            } else {
              state.setUsers(toJS(userStore.followers))
            }
          }
        }
        state.setSearching(false)
      }, 250)
    })
    const disposeSearchType = autorun(() => {
      if (state.searchType === SearchType.POST) {
        typeAnim.value = withTiming(0)
        listRef?.current?.scrollTo?.({
          x: 0,
          animated: true,
        })
      } else {
        typeAnim.value = withTiming(1)
        listRef?.current?.scrollTo?.({
          x: screenWidth,
          animated: true,
        })
      }
    })
    return () => {
      dispose()
      disposeSearchType()
      clearTimeout(to)
    }
  }, [])
  const onLoadMore = useCallback(async () => {
    if (state.loadingMore) {
      return
    }
    state.setLoadingMore(true)
    const response = await searchPosts(
      state.q,
      state.type || '',
      state.page + 1,
    )
    if (response?.status === 'OK') {
      state.setPosts([...state.posts, ...response.data])
      state.setPage(state.page + 1)
    } else {
      state.setPosts([...state.posts, ...mockPosts])
    }
    state.setLoadingMore(false)
  }, [])
  const onLoadMoreUserPress = useCallback(async () => {
    if (state.loadingMoreUsers) {
      return
    }
    state.setLoadingMoreUsers(true)
    const response = await searchUsers(state.q, state.userPage + 1)
    if (response?.status === 'OK') {
      state.setUsers([...state.users, ...response.data])
      state.setUserPage(state.userPage + 1)
    } else {
      state.setUsers([...state.users, ...mockUsers])
    }
    state.setLoadingMoreUsers(false)
  }, [])
  const renderFilterTypeItem = useCallback(({ item, index }) => {
    const onPress = () => {
      state.setType(
        item.type === state.type && state.searchType === SearchType.POST
          ? null
          : item.type,
      )
      filterRef.current?.scrollToIndex?.({ index, viewPosition: 0.5 })
    }
    return (
      <Pressable onPress={onPress} style={styles.filterBtn}>
        <Obx>
          {() =>
            state.type === item.type && (
              <Animated.View entering={FadeIn} style={styles.filterBgView} />
            )
          }
        </Obx>
        {!!item.icon && (
          <>
            <Obx>
              {() => (
                <item.icon
                  color={
                    state.type === item.type ? Colors.white : Colors.placeholder
                  }
                  size={16}
                />
              )}
            </Obx>
            <Padding left={6} />
          </>
        )}

        <Obx>
          {() => (
            <AppText
              lineHeight={18}
              fontWeight={600}
              color={
                state.type === item.type ? Colors.white : Colors.placeholder
              }
            >
              {t(item.name)}
            </AppText>
          )}
        </Obx>
      </Pressable>
    )
  }, [])
  const renderUserItem = useCallback(({ item }) => {
    return (
      <RNTouchableOpacity onPress={() => navigateToProfile(item.user_id)}>
        <Animated.View style={styles.userItem}>
          <AppImage
            style={styles.userAvatar}
            source={{
              uri: item.avatar_url,
            }}
          />
          <Box fill paddingLeft={12}>
            <Row justify="space-between">
              <View>
                <AppText fontWeight={600} lineHeight={16}>
                  {item.full_name}
                </AppText>
                <AppText
                  fontSize={12}
                  lineHeight={14}
                  color={Colors.placeholder}
                >
                  @{item.user_id}
                </AppText>
              </View>
              <Obx>
                {() => {
                  const isFollowing = userStore.isFollowing(item.user_id)
                  return (
                    <RNTouchableOpacity
                      onPress={() => {
                        if (isFollowing) {
                          userStore.unfollowUser(item)
                        } else {
                          userStore.followUser(item)
                        }
                      }}
                      style={styles.followBtn}
                    >
                      {isFollowing ? (
                        <UnfollowSvg size={16} color={Colors.white} />
                      ) : (
                        <FollowSvg size={16} color={Colors.white} />
                      )}
                      <Padding left={4} />
                      <AppText
                        fontSize={12}
                        fontWeight={500}
                        color={Colors.white}
                      >
                        {t(
                          isFollowing ? 'profile.following' : 'profile.follow',
                        )}
                      </AppText>
                    </RNTouchableOpacity>
                  )
                }}
              </Obx>
            </Row>
            <Padding top={10} />
            <AppText fontSize={12} numberOfLines={1}>
              {item.bio}
            </AppText>
          </Box>
        </Animated.View>
      </RNTouchableOpacity>
    )
  }, [])
  const renderGridItem = useCallback(({ item, index }) => {
    return <GridItem item={item} index={index} />
  }, [])
  const activeTypeWidth = ResponsiveWidth(55)
  const activeTypeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: typeAnim.value * activeTypeWidth }],
  }))

  return (
    <Container
      statusBarProps={{ barStyle: 'light-content' }}
      safeAreaColor={Colors.primary}
      style={styles.rootView}
    >
      <Box backgroundColor={Colors.primary} paddingBottom={10}>
        <Box
          height={40}
          backgroundColor={Colors.white}
          margin={16}
          row
          align="center"
          radius={8}
          paddingHorizontal={10}
        >
          <SearchSvg color={Colors.placeholder} size={18} />
          <Padding right={8} />
          <AppInput
            style={Layout.fill}
            fontWeight={500}
            placeholder={t('search.search_placeholder')}
            placeholderTextColor={Colors.placeholder}
          />
          <Box
            row
            align="center"
            width={120}
            height={30}
            backgroundColor={Colors.border}
            radius={4}
            paddingHorizontal={5}
          >
            <Animated.View style={[styles.activeTypeView, activeTypeStyle]} />
            <RNTouchableOpacity
              onPress={() => state.setSearchType(SearchType.POST)}
              style={styles.typeBtn}
            >
              <AppText fontSize={12} fontWeight={600}>
                {t('search.posts')}
              </AppText>
            </RNTouchableOpacity>
            <RNTouchableOpacity
              onPress={() => {
                state.setSearchType(SearchType.PEOPLE)
                state.setType(PeopleFilterType.All)
              }}
              style={styles.typeBtn}
            >
              <AppText fontSize={12} fontWeight={600}>
                {t('search.people')}
              </AppText>
            </RNTouchableOpacity>
          </Box>
        </Box>
        <Obx>
          {() =>
            state.searchType === SearchType.POST ? (
              <Animated.FlatList
                key={SearchType.POST}
                entering={FadeInLeft}
                ref={filterRef}
                ListHeaderComponent={<Padding left={16} />}
                data={TagFilterTypes}
                renderItem={renderFilterTypeItem}
                keyExtractor={item => item.type}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Animated.FlatList
                key={SearchType.PEOPLE}
                entering={FadeInRight}
                ref={filterRef}
                ListHeaderComponent={<Padding left={16} />}
                data={PeopleFilterTypes}
                renderItem={renderFilterTypeItem}
                keyExtractor={item => item.type}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )
          }
        </Obx>
      </Box>
      <Obx>
        {() =>
          state.loading ? (
            <Box paddingVertical={50} center>
              <LoadingIndicator />
            </Box>
          ) : (
            <Box fill paddingTop={5}>
              <ScrollView
                scrollEnabled={false}
                ref={listRef}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <View paddingLeft={ResponsiveWidth(5)} width={screenWidth}>
                  <Obx>
                    {() => (
                      <MasonryFlashList
                        ListEmptyComponent={
                          <Obx>
                            {() =>
                              state.searching && (
                                <Box paddingVertical={50} center>
                                  <LoadingIndicator />
                                </Box>
                              )
                            }
                          </Obx>
                        }
                        key={SearchType.POST}
                        data={state.posts.slice()}
                        numColumns={3}
                        renderItem={renderGridItem}
                        keyExtractor={item => item.post_id}
                        ListFooterComponent={
                          <Box height={90} center>
                            <Obx>
                              {() =>
                                state.loadingMore && (
                                  <LoadingIndicator type="ThreeBounce" />
                                )
                              }
                            </Obx>
                          </Box>
                        }
                        showsVerticalScrollIndicator={false}
                        estimatedItemSize={(screenWidth / 3) * 1.5}
                        onEndReached={onLoadMore}
                        onEndReachedThreshold={0.5}
                      />
                    )}
                  </Obx>
                </View>
                <Obx>
                  {() => (
                    <Animated.FlatList
                      style={{ width: screenWidth }}
                      key={SearchType.PEOPLE}
                      entering={FadeInRight}
                      data={state.users.slice()}
                      renderItem={renderUserItem}
                      keyExtractor={item => item.user_id}
                      ListFooterComponent={
                        <Box
                          paddingTop={12}
                          paddingBottom={90}
                          marginHorizontal={12}
                        >
                          <Obx>
                            {() =>
                              state.users.length > 8 && (
                                <AppButton
                                  disabled={state.loadingMoreUsers}
                                  disabledBackgroundColor={Colors.primary}
                                  spacing={state.loadingMoreUsers ? 0 : 4}
                                  onPress={onLoadMoreUserPress}
                                  text={
                                    state.loadingMoreUsers
                                      ? ''
                                      : t('search.view_more')
                                  }
                                  textSize={12}
                                  backgroundColor={Colors.primary}
                                  svgIcon={
                                    state.loadingMoreUsers ? (
                                      <LoadingIndicator color={Colors.white} />
                                    ) : (
                                      <ArrowRightSvg
                                        color={Colors.white}
                                        size={14}
                                      />
                                    )
                                  }
                                />
                              )
                            }
                          </Obx>
                        </Box>
                      }
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </Obx>
              </ScrollView>
              {isIOS && <KeyboardSpacer />}
            </Box>
          )
        }
      </Obx>
    </Container>
  )
}

export default SearchScreen

export const GridItem = memo(({ item, index }) => {
  const isVideo = item.medias[0].is_video
  const row = Math.floor(index / 3)
  const col = index % 3
  const height = useMemo(() => {
    if (
      (row % 2 === 0 && (1 + col) % 3 === 0) ||
      ((row + 1) % 2 === 0 && col % 3 === 0) ||
      ((col + 1) % 3 === 2 && row % 2 === 0 && row > 1)
    ) {
      return ((screenWidth - ResponsiveWidth(20)) / 3) * 2 + ResponsiveHeight(5)
    }
    return (screenWidth - ResponsiveWidth(20)) / 3
  }, [row, col])
  const mediaStyle = {
    width: (screenWidth - ResponsiveWidth(20)) / 3,
    height,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.border,
  }
  return (
    <TouchableOpacity
      onPress={() =>
        navigate(PageName.PostDetailScreen, {
          postId: item.post_id,
        })
      }
      style={styles.gridItem}
    >
      {isVideo ? (
        <Video
          muted
          renderToHardwareTextureAndroid
          source={{
            uri: item.medias[0].url,
          }}
          style={mediaStyle}
        />
      ) : (
        <AppImage
          disabled
          source={{
            uri: item.medias[0].url,
          }}
          containerStyle={mediaStyle}
        />
      )}
      {item.medias.length > 1 && (
        <View style={styles.typeIndicatorView}>
          <MultipleSvg color={Colors.white75} size={16} />
        </View>
      )}
      {isVideo && (
        <View style={styles.typeIndicatorView}>
          <VideoSvg color={Colors.white75} size={16} />
        </View>
      )}
    </TouchableOpacity>
  )
})
const styles = XStyleSheet.create({
  rootView: {
    backgroundColor: Colors.white,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    backgroundColor: Colors.white,
    marginRight: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  filterBgView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: Colors.secondary,
  },
  gridItem: {
    marginBottom: 5,
  },
  typeIndicatorView: {
    position: 'absolute',
    top: 8,
    right: 12,
  },
  activeTypeView: {
    position: 'absolute',
    left: 5,
    width: 55,
    height: 20,
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  typeBtn: {
    width: 55,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.kF8F8F8,
    marginHorizontal: 12,
    padding: 6,
    marginTop: 12,
    borderRadius: 6,
  },
  userAvatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
})
