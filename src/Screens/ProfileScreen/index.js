import { CameraSvg, ChevronRightSvg, SettingSvg } from '@/Assets/Svg'
import {
  AppImage,
  AppText,
  Box,
  Container,
  Padding,
  Position,
  PostGridItem,
} from '@/Components'
import { mockPosts } from '@/Models'
import { Colors, Layout, XStyleSheet } from '@/Theme'
import { BlurView } from '@react-native-community/blur'
import React, { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileScreen = () => {
  const scrollY = useSharedValue(0)
  const headerButtonAnim = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y
      if (event.contentOffset.y > 150 && headerButtonAnim.value === 0) {
        headerButtonAnim.value = withTiming(1)
      } else if (event.contentOffset.y < 150 && headerButtonAnim.value === 1) {
        headerButtonAnim.value = withTiming(0)
      }
    },
  })

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

  const renderPostItem = useCallback(({ item }) => {
    const onPress = () => {}
    return <PostGridItem onPress={onPress} post={item} />
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
                <CameraSvg />
              </TouchableOpacity>
            </Animated.View>
          </Box>
        </SafeAreaView>
      </Position>
      <Animated.FlatList
        ListHeaderComponent={
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
                <TouchableOpacity style={styles.updateAvatarBtn}>
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
          </Box>
        }
        ListFooterComponent={
          <Box height={90} backgroundColor={Colors.kE6EEFA} />
        }
        columnWrapperStyle={styles.listView}
        onScroll={scrollHandler}
        numColumns={3}
        data={mockPosts.concat(mockPosts).concat(mockPosts)}
        renderItem={renderPostItem}
        keyExtractor={item => item.post_id}
      />
    </Container>
  )
}

export default ProfileScreen

const styles = XStyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.kE6EEFA,
  },
  listView: {
    backgroundColor: Colors.kE6EEFA,
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
})
