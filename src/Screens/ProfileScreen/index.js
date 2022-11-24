import {
  BookMarkSvg,
  CameraSvg,
  DotsSvg,
  GridSvg,
  SettingSvg,
  VideoSvg,
} from '@/Assets/Svg'
import {
  AppBottomSheet,
  AppImage,
  AppText,
  Box,
  Container,
  LoadingIndicator,
  Obx,
  Padding,
  Position,
  PostGridItem,
  PostPreviewModal,
} from '@/Components'
import { PageName } from '@/Config'
import { useAppTheme } from '@/Hooks'
import { navigate } from '@/Navigators'
import { EditProfileNavigator } from '@/Navigators/Application'
import { userStore } from '@/Stores'
import { Colors, Layout, screenHeight, XStyleSheet } from '@/Theme'
import { BlurView } from '@react-native-community/blur'
import { createNavigationContainerRef } from '@react-navigation/native'
import { flowResult } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
const PostType = {
  Post: 'post',
  Bookmark: 'bookmark',
  Video: 'video',
}

const ProfileScreen = () => {
  const { t } = useTranslation()
  const { Images } = useAppTheme()
  const scrollY = useSharedValue(0)
  const headerButtonAnim = useSharedValue(0)
  const editSheetRef = useRef()
  const editNavigatorRef = createNavigationContainerRef()
  const state = useLocalObservable(() => ({
    postType: PostType.Post,
    previewPost: null,
    updatingCover: false,
    updatingAvatar: false,
    setPreviewPost: (post, specs) => (state.previewPost = { post, specs }),
    hidePreviewPost: () => (state.previewPost = null),
    setPostType: postType => (state.postType = postType),
    setUpdatingCover: updatingCover => (state.updatingCover = updatingCover),
    setUpdatingAvatar: updatingAvatar =>
      (state.updatingAvatar = updatingAvatar),
    get filteredPosts() {
      const photoPosts = userStore.posts
        .filter(post => !post.medias[0].is_video)
        .slice()
      const videoPosts = userStore.posts
        .filter(post => post.medias[0].is_video)
        .slice()
      const bookmarkPosts = userStore.bookmarkPosts.slice()
      return [
        ...PostTabs,
        ...(state.postType === PostType.Post
          ? photoPosts
          : state.postType === PostType.Bookmark
          ? bookmarkPosts
          : videoPosts),
      ]
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
        type: PostType.Post,
        icon: (
          <Obx>
            {() => (
              <GridSvg
                color={
                  state.postType === PostType.Post
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
        type: PostType.Bookmark,
        icon: (
          <Obx>
            {() => (
              <BookMarkSvg
                color={
                  state.postType === PostType.Bookmark
                    ? Colors.secondary
                    : Colors.gray
                }
              />
            )}
          </Obx>
        ),
      },
      {
        type: PostType.Video,
        icon: (
          <Obx>
            {() => (
              <VideoSvg
                color={
                  state.postType === PostType.Video
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
  const updateProfileImage = onNext => {
    try {
      navigate(PageName.MediaPicker, {
        type: 'photo',
        multiple: false,
        disableVideo: true,
        editable: true,
        editorProps: {
          onNext: medias => {
            navigate(PageName.ProfileScreen)
            onNext(medias)
          },
        },
      })
    } catch (e) {
      console.log({ updateProfileImage })
    }
  }
  const onUpdateAvatarPress = useCallback(() => {
    updateProfileImage(async medias => {
      state.setUpdatingAvatar(true)
      await flowResult(userStore.updateProfileImage(medias[0]))
      state.setUpdatingAvatar(false)
    })
  }, [])
  const onUpdateCoverPress = useCallback(() => {
    updateProfileImage(async medias => {
      if (medias.length > 0) {
        state.setUpdatingCover(true)
        await flowResult(userStore.updateProfileImage(medias[0], true))
        state.setUpdatingCover(false)
      }
    })
  }, [])

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
            <Obx>
              {() => (
                <Box overflow="hidden" radius={99} center marginTop={-50}>
                  <AppImage
                    containerStyle={styles.avatar}
                    source={{
                      uri: userStore.userInfo.avatar_url,
                    }}
                    lightbox
                  />
                  <Obx>
                    {() =>
                      state.updatingAvatar && (
                        <View style={styles.uploadingView}>
                          <LoadingIndicator size={16} color={Colors.white} />
                        </View>
                      )
                    }
                  </Obx>
                </Box>
              )}
            </Obx>
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
        <Box paddingHorizontal={50} marginTop={0} center>
          <AppText fontWeight={700} fontSize={20}>
            {userStore.userInfo.full_name}
          </AppText>
          <AppText fontWeight={600} color={Colors.placeholder} fontSize={12}>
            @{userStore.userInfo.user_id}
          </AppText>
          <Padding top={8} />
          <AppText align="center" color={Colors.k6C7A9C} lineHeight={20}>
            {userStore.userInfo.bio}
          </AppText>
        </Box>
        <Box marginTop={16} paddingHorizontal={16} row align="center">
          <TouchableOpacity
            onPress={() => editSheetRef.current.snapTo(0)}
            style={styles.optionBtn}
          >
            <AppText fontWeight={700} color={Colors.white}>
              {t('profile.edit_profile')}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn}>
            <DotsSvg size={16} color={Colors.white} />
          </TouchableOpacity>
        </Box>
      </Box>
    ),
    [],
  )
  const ListFooterComponent = useMemo(() => {
    return (
      <Obx>
        {() =>
          state.filteredPosts.length === 3 && (
            <Box height={250} center backgroundColor={Colors.white}>
              <>
                <Image
                  style={styles.emptyIcon}
                  resizeMode="contain"
                  source={Images.pack4_15}
                />
                {state.postType === PostType.Post ? (
                  <AppText
                    fontSize={16}
                    fontWeight={600}
                    color={Colors.placeholder}
                  >
                    {t('profile.you_have_not_photo_yet')}
                  </AppText>
                ) : state.postType === PostType.Bookmark ? (
                  <AppText
                    fontSize={16}
                    fontWeight={600}
                    color={Colors.placeholder}
                  >
                    {t('profile.you_have_not_bookmark_yet')}
                  </AppText>
                ) : (
                  <AppText
                    fontSize={16}
                    fontWeight={600}
                    color={Colors.placeholder}
                  >
                    {t('profile.you_have_not_video_yet')}
                  </AppText>
                )}
              </>
            </Box>
          )
        }
      </Obx>
    )
  }, [])

  const headerOverlayStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(scrollY.value, [0, 100], [0, 1]),
    }),
    [],
  )

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
        navigate(PageName.PostDetailScreen, {
          postId: item.post_id,
        })
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
  const { top } = useSafeAreaInsets()
  return (
    <Container disableTop style={styles.rootView}>
      <Position top={0} left={0} right={0} zIndex={-1}>
        <Box height={250}>
          <Obx>
            {() => (
              <AppImage
                source={{
                  uri: userStore.userInfo.cover_url,
                }}
                resizeMode="cover"
                containerStyle={styles.coverPhoto}
              />
            )}
          </Obx>
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
            <View />
            <Animated.View style={headerRightButtonStyle}>
              <TouchableOpacity style={styles.headerBtn}>
                <SettingSvg />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onUpdateCoverPress}
                style={styles.headerBtn}
              >
                <CameraSvg strokeWidth={2} />
              </TouchableOpacity>
            </Animated.View>
          </Box>
        </SafeAreaView>
      </Position>
      <Obx>
        {() => (
          <Animated.FlatList
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooterComponent}
            columnWrapperStyle={styles.listView}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            numColumns={3}
            data={state.filteredPosts.slice()}
            stickyHeaderIndices={[1]}
            renderItem={renderPostItem}
            keyExtractor={item => item.post_id}
            initialNumToRender={9}
            showsVerticalScrollIndicator={false}
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
      <AppBottomSheet
        backgroundStyle={{ backgroundColor: Colors.transparent }}
        snapPoints={[screenHeight * 0.8, screenHeight - top]}
        ref={editSheetRef}
      >
        <EditProfileNavigator ref={editNavigatorRef} />
      </AppBottomSheet>
    </Container>
  )
}

export default ProfileScreen

const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
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
    backgroundColor: Colors.kC2C2C2,
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
  uploadingView: {
    ...XStyleSheet.absoluteFillObject,
    zIndex: 99,
    backgroundColor: Colors.black50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
})
