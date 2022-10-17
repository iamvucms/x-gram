import {
  BookMarkedSvg,
  BookMarkSvg,
  CameraSvg,
  ChevronRightSvg,
  GridSvg,
  MenuSvg,
  ReelSvg,
  SettingSvg,
  VideoSvg,
} from '@/Assets/Svg'
import {
  AppImage,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
  Position,
  PostGridItem,
  PostPreviewModal,
} from '@/Components'
import { PageName } from '@/Config'
import { mockPosts } from '@/Models'
import { navigate } from '@/Navigators'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { BlurView } from '@react-native-community/blur'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
const PostType = {
  post: 'post',
  bookmark: 'bookmark',
  reel: 'reel',
}
const ProfileScreen = () => {
  const { t } = useTranslation()
  const scrollY = useSharedValue(0)
  const headerButtonAnim = useSharedValue(0)

  const state = useLocalObservable(() => ({
    posts: mockPosts,
    postType: PostType.post,
    previewPost: null,
    setPreviewPost: (post, specs) => (state.previewPost = { post, specs }),
    hidePreviewPost: () => (state.previewPost = null),
    setPosts: posts => (state.posts = posts),
    setPostType: postType => (state.postType = postType),
    get filteredPosts() {
      return [...PostTabs, ...this.posts]
    },
  }))

  const scrollHandler = useCallback(event => {
    scrollY.value = event.nativeEvent.contentOffset.y
    if (
      event.nativeEvent.contentOffset.y > 150 &&
      headerButtonAnim.value === 0
    ) {
      headerButtonAnim.value = withTiming(1)
    } else if (
      event.nativeEvent.contentOffset.y < 150 &&
      headerButtonAnim.value === 1
    ) {
      headerButtonAnim.value = withTiming(0)
    }
  }, [])

  const PostTabs = useMemo(
    () => [
      {
        type: PostType.post,
        icon: (
          <Obx>
            {() => (
              <GridSvg
                color={
                  state.postType === PostType.post
                    ? Colors.secondary
                    : Colors.gray
                }
                size={20}
              />
            )}
          </Obx>
        ),
      },
      {
        type: PostType.bookmark,
        icon: (
          <Obx>
            {() => (
              <BookMarkSvg
                color={
                  state.postType === PostType.bookmark
                    ? Colors.secondary
                    : Colors.gray
                }
              />
            )}
          </Obx>
        ),
      },
      {
        type: PostType.reel,
        icon: (
          <Obx>
            {() => (
              <ReelSvg
                color={
                  state.postType === PostType.reel
                    ? Colors.secondary
                    : Colors.gray
                }
                size={28}
              />
            )}
          </Obx>
        ),
      },
    ],
    [],
  )

  const onUpdateAvatarPress = useCallback(async () => {
    try {
      navigate(PageName.MediaPicker, {
        type: 'photo',
        multiple: false,
        onNext: medias => {
          console.log(medias)
        },
      })
    } catch (e) {
      console.log(e)
    }
  }, [])
  const onUpdateCoverPress = useCallback(() => {}, [])

  const ListHeader = useMemo(
    () => (
      <Box
        backgroundColor={Colors.kE6EEFA}
        topLeftRadius={50}
        topRightRadius={50}
        marginTop={200}
        paddingBottom={24}
      >
        <Box row paddingHorizontal={20}>
          <TouchableOpacity style={styles.infoBtn}>
            <AppText fontWeight={700}>1k</AppText>
            <Padding top={4} />
            <AppText color={Colors.black75}>Followers</AppText>
          </TouchableOpacity>
          <View>
            <AppImage
              containerStyle={styles.avatar}
              source={{
                uri: 'https://picsum.photos/1000/1000',
              }}
            />
            <TouchableOpacity
              onPress={onUpdateAvatarPress}
              style={styles.updateAvatarBtn}
            >
              <CameraSvg />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.infoBtn}>
            <AppText fontWeight={700}>1k</AppText>
            <Padding top={4} />
            <AppText color={Colors.black75}>Following</AppText>
          </TouchableOpacity>
        </Box>
        <Box paddingHorizontal={50} marginTop={16} center>
          <AppText fontWeight={700} fontSize={16}>
            @username
          </AppText>
          <AppText align="center" color={Colors.k6C7A9C} lineHeight={20}>
            This is a description of the user. This is a description of the
            user. This is a description of the user.
          </AppText>
        </Box>
        <Box marginTop={16} paddingHorizontal={16} row align="center">
          {/* <TouchableOpacity style={styles.optionBtn}>
                <AppText fontWeight={700} color={Colors.white}>
                  Follow
                </AppText>
              </TouchableOpacity>
              <Padding left={16} /> */}
          <TouchableOpacity style={styles.optionBtn}>
            <AppText fontWeight={700} color={Colors.white}>
              {t('profile.edit_profile')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn}>
            <MenuSvg size={16} color={Colors.white} />
          </TouchableOpacity>
        </Box>
      </Box>
    ),
    [],
  )

  const headerOverlayStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(scrollY.value, [0, 100], [0, 1]),
    }),
    [],
  )

  const headerLeftButtonStyle = useAnimatedStyle(() => ({
    opacity: 1 - headerButtonAnim.value,
    transform: [
      {
        translateX: headerButtonAnim.value * -100,
      },
    ],
  }))
  const headerRightButtonStyle = useAnimatedStyle(() => ({
    opacity: 1 - headerButtonAnim.value,
    transform: [
      {
        translateX: headerButtonAnim.value * 100,
      },
    ],
  }))

  const onOpenPreview = useCallback((post, { x, y, height, width }) => {
    state.setPreviewPost(post, { x, y, height, width })
  }, [])

  const renderPostItem = useCallback(({ item, index }) => {
    const onPress = () => {
      if (index <= 2) {
        state.setPostType(item.type)
      } else {
      }
    }
    return index <= 2 ? (
      <TouchableOpacity onPress={onPress} style={styles.tabView}>
        {item.icon}
      </TouchableOpacity>
    ) : (
      <PostGridItem
        enablePreview
        onOpenPreview={specs => onOpenPreview(item, specs)}
        onClosePreview={() => state.hidePreviewPost()}
        onPress={onPress}
        post={item}
      />
    )
  }, [])
  return (
    <Container style={styles.rootView}>
      <Position top={0} left={0} right={0} zIndex={-1}>
        <Box height={250}>
          <AppImage
            source={{
              uri: 'https://picsum.photos/1024/1024',
            }}
            resizeMode="cover"
            containerStyle={styles.coverPhoto}
          />
          <Animated.View style={[Layout.fill, headerOverlayStyle]}>
            <BlurView style={Layout.fill} />
          </Animated.View>
        </Box>
      </Position>
      <Position top={0} left={0} right={0} zIndex={99}>
        <SafeAreaView>
          <Box
            marginTop={10}
            row
            justify="space-between"
            paddingHorizontal={16}
          >
            <Animated.View style={headerLeftButtonStyle}>
              <TouchableOpacity style={styles.headerBtn}>
                <View style={{ transform: [{ rotate: '180deg' }] }}>
                  <ChevronRightSvg />
                </View>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={headerRightButtonStyle}>
              <TouchableOpacity style={styles.headerBtn}>
                <SettingSvg />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn}>
                <CameraSvg strokeWidth={2} />
              </TouchableOpacity>
            </Animated.View>
          </Box>
        </SafeAreaView>
      </Position>
      <Obx>
        {() => (
          <FlatList
            ListHeaderComponent={ListHeader}
            ListFooterComponent={
              <Box height={90} backgroundColor={Colors.kE6EEFA} />
            }
            columnWrapperStyle={styles.listView}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            numColumns={3}
            data={state.filteredPosts.slice()}
            stickyHeaderIndices={[1]}
            renderItem={renderPostItem}
            keyExtractor={(item, index) => item.post_id || index}
          />
        )}
      </Obx>
      <Obx>
        {() => (
          <PostPreviewModal
            visible={!!state.previewPost}
            post={state?.previewPost?.post}
            {...(state?.previewPost?.specs || {})}
          />
        )}
      </Obx>
    </Container>
  )
}

export default ProfileScreen

const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listView: {
    backgroundColor: Colors.white,
  },
  coverPhoto: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  infoBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    borderColor: Colors.white,
    borderWidth: 4,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateAvatarBtn: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.white50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    right: 0,
  },
  optionBtn: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  settingBtn: {
    height: 44,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 5,
    marginLeft: 16,
  },
  tabView: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    paddingVertical: 30,
    marginBottom: 10,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.5,
  },
})
