import {
  CopySvg,
  MultipleSvg,
  SearchSvg,
  StackSvg,
  VideoSvg,
} from '@/Assets/Svg'
import {
  AppImage,
  AppInput,
  AppText,
  Box,
  Container,
  Obx,
  Padding,
} from '@/Components'
import { mockPosts, TagFilterTypes } from '@/Models'
import { searchPosts } from '@/Services/Api'
import {
  Colors,
  Layout,
  ResponsiveHeight,
  ResponsiveWidth,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import { autorun } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { MasonryFlashList } from '@shopify/flash-list'
import { navigate } from '@/Navigators'
import { PageName } from '@/Config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Video from 'react-native-video'
const SearchScreen = () => {
  const { t } = useTranslation()
  const filterRef = useRef()
  const state = useLocalObservable(() => ({
    type: null,
    setType: type => (state.type = type),
    posts: mockPosts,
    setPosts: posts => (state.posts = posts),
    page: 1,
    setPage: page => (state.page = page),
    q: '',
    setQ: q => (state.q = q),
    searching: false,
    setSearching: searching => (state.searching = searching),
    loadingMore: false,
    setLoadingMore: loadingMore => (state.loadingMore = loadingMore),
  }))
  useEffect(() => {
    let to = null
    const dispose = autorun(() => {
      clearTimeout(to)
      const q = state.q
      const tag = state.type || ''
      to = setTimeout(async () => {
        state.setSearching(true)
        const response = await searchPosts(q, tag, state.page)
        if (response?.status === 'OK') {
          state.setPosts(response.data)
        } else {
          state.setPosts(mockPosts)
        }
        state.setSearching(false)
      }, 250)
    })
    return () => {
      dispose()
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
  const renderFilterTypeItem = useCallback(({ item, index }) => {
    const onPress = () => {
      state.setType(item.type === state.type ? null : item.type)
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
        <Obx>
          {() => (
            <item.icon
              color={
                state.type === item.type ? Colors.white : Colors.placeholder
              }
              size={14}
            />
          )}
        </Obx>
        <Padding left={6} />
        <Obx>
          {() => (
            <AppText
              fontSize={12}
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
  const renderGridItem = useCallback(({ item, index }) => {
    return <GridItem item={item} index={index} />
  }, [])
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
        </Box>
        <FlatList
          ref={filterRef}
          ListHeaderComponent={<Padding left={16} />}
          data={TagFilterTypes}
          renderItem={renderFilterTypeItem}
          keyExtractor={item => item.type}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </Box>
      <Box fill paddingTop={5} paddingLeft={5}>
        <Obx>
          {() => (
            <MasonryFlashList
              data={state.posts.slice()}
              numColumns={3}
              renderItem={renderGridItem}
              keyExtractor={item => item.post_id}
              ListFooterComponent={<Padding bottom={110} />}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={(screenWidth / 3) * 1.5}
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.5}
            />
          )}
        </Obx>
      </Box>
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
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: (screenWidth - ResponsiveWidth(20)) / 3,
            height,
            borderRadius: 8,
            overflow: 'hidden',
          }}
        />
      ) : (
        <AppImage
          source={{
            uri: item.medias[0].url,
          }}
          // eslint-disable-next-line react-native/no-inline-styles
          containerStyle={{
            width: (screenWidth - ResponsiveWidth(20)) / 3,
            height,
            borderRadius: 8,
            overflow: 'hidden',
          }}
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
})
