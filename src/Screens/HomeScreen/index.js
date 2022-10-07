import { Container, Padding, PostItem } from '@/Components'
import { Colors, XStyleSheet } from '@/Theme'
import React, { useCallback } from 'react'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { HomeMenu, StoryBar } from './HomeScreenComponents'

const HomeScreen = () => {
  const scrollY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
    },
  })

  const renderPostItem = useCallback(({ item }) => {
    return <PostItem post={item} />
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
