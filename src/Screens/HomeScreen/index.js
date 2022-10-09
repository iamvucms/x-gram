import {
  CommentBottomSheet,
  Container,
  Obx,
  Padding,
  PostItem,
  ShareBottomSheet,
} from '@/Components'
import { ShareType } from '@/Models'
import { Colors, XStyleSheet } from '@/Theme'
import { useLocalObservable } from 'mobx-react-lite'
import React, { useCallback, useRef } from 'react'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { HomeMenu, StoryBar } from './HomeScreenComponents'

const SheetType = {
  COMMENT: 'COMMENT',
  SHARE: 'SHARE',
}

const HomeScreen = () => {
  const commentSheetRef = useRef()
  const shareSheetRef = useRef()
  const scrollY = useSharedValue(0)
  const state = useLocalObservable(() => ({
    selectedPost: null,
    sheetType: null,
    setType(type) {
      this.sheetType = type
    },
    setSelectedPost(post) {
      this.selectedPost = post
    },
  }))
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
    },
  })

  const renderPostItem = useCallback(({ item }) => {
    const onCommentPress = () => {
      state.setSelectedPost(item)
      state.setType(SheetType.COMMENT)
    }
    const onSharePress = () => {
      state.setSelectedPost(item)
      state.setType(SheetType.SHARE)
    }
    return (
      <PostItem
        onSharePress={onSharePress}
        onCommentPress={onCommentPress}
        post={item}
      />
    )
  }, [])

  return (
    <Container
      safeAreaColor={Colors.k222222}
      disableTop={false}
      style={styles.rootView}
      statusBarProps={{ barStyle: 'light-content' }}
    >
      <HomeMenu />
      <Animated.FlatList
        ListHeaderComponent={<StoryBar scrollY={scrollY} />}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        data={new Array(5).fill(0)}
        renderItem={renderPostItem}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={<Padding bottom={110} />}
        showsVerticalScrollIndicator={false}
      />
      <Obx>
        {() =>
          state.sheetType === SheetType.COMMENT && (
            <CommentBottomSheet
              onClose={() => state.setType(null)}
              ref={commentSheetRef}
            />
          )
        }
      </Obx>
      <Obx>
        {() =>
          state.sheetType === SheetType.SHARE && (
            <ShareBottomSheet
              type={ShareType.Post}
              onClose={() => state.setType(null)}
              ref={shareSheetRef}
            />
          )
        }
      </Obx>
    </Container>
  )
}

export default HomeScreen
const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
})
