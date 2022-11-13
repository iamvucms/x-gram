import { useAppTheme } from '@/Hooks'
import { getStickerPacks } from '@/Models'
import { Colors, Layout, screenHeight, screenWidth, XStyleSheet } from '@/Theme'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useLocalObservable } from 'mobx-react-lite'
import React, { forwardRef, memo, useCallback, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Box, LoadingIndicator, Obx } from '.'
import AppBottomSheet from './AppBottomSheet'
interface StickerPickerSheetProps {
  onSelectSticker: (sourceId) => void
}
const StickerPickerSheet = forwardRef(
  ({ onSelectSticker }: StickerPickerSheetProps, ref) => {
    const { Images } = useAppTheme()
    const stickerPacks = useMemo(
      () => getStickerPacks({ imageSource: Images }),
      [Images],
    )
    const state = useLocalObservable(() => ({
      packId: stickerPacks[0].id,
      setPackId: id => (state.packId = id),
      loading: true,
      setLoading: loading => (state.loading = loading),
      get currentPackStickers() {
        return stickerPacks.find(item => item.id === this.packId).stickers
      },
    }))
    useEffect(() => {
      const to = setTimeout(() => {
        state.setLoading(false)
      }, 1000)
      return () => clearTimeout(to)
    }, [])
    const renderStickerItem = useCallback(({ item, index }) => {
      const onPress = () => {
        onSelectSticker(item)
      }
      return (
        <TouchableOpacity
          key={`sticker-${index}`}
          onPress={onPress}
          style={styles.stickerBtn}
        >
          <FastImage style={styles.stickerImg} source={item} />
        </TouchableOpacity>
      )
    }, [])
    const renderPackItem = useCallback(({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => state.setPackId(item.id)}
          style={styles.packBtn}
        >
          <FastImage style={styles.packImg} source={item.stickers[0]} />
          <Obx>
            {() =>
              state.packId === item.id && (
                <View style={styles.selectedIndicator} />
              )
            }
          </Obx>
        </TouchableOpacity>
      )
    }, [])
    const { bottom } = useSafeAreaInsets()
    return (
      <AppBottomSheet
        ref={ref}
        backgroundStyle={{ backgroundColor: Colors.transparent }}
        snapPoints={[screenHeight * 0.55]}
      >
        <Box style={Layout.fill} backgroundColor={Colors.black50}>
          <Box fill>
            <Obx>
              {() =>
                state.loading ? (
                  <Box fill center>
                    <LoadingIndicator />
                  </Box>
                ) : (
                  <BottomSheetFlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={4}
                    data={state.currentPackStickers.slice()}
                    renderItem={renderStickerItem}
                    keyExtractor={item => item}
                  />
                )
              }
            </Obx>
          </Box>
          <Box height={50 + bottom} paddingBottom={bottom}>
            <BottomSheetFlatList
              data={stickerPacks}
              renderItem={renderPackItem}
              keyExtractor={item => `${item.id}`}
              horizontal
              showsVerticalScrollIndicator={false}
            />
          </Box>
        </Box>
      </AppBottomSheet>
    )
  },
)

export default StickerPickerSheet

const styles = XStyleSheet.create({
  stickerBtn: {
    flex: 1,
    width: screenWidth / 4,
    aspectRatio: 1,
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickerImg: {
    width: (screenWidth / 4) * 0.8,
    height: (screenWidth / 4) * 0.8,
    resizeMode: 'contain',
    skipResponsive: true,
  },
  packBtn: {
    flex: 1,
    width: screenWidth / 6,
    skipResponsive: true,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packImg: {
    height: 30,
    width: 30,
    marginVertical: 10,
  },
  selectedIndicator: {
    position: 'absolute',
    zIndex: 1,
    bottom: 3,
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
})
