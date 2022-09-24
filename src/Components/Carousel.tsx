import { moderateScale, screenWidth, XStyleSheet } from '@/Theme'
import { caculatePageWidthForPagination } from '@/Utils'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import {
  FlatListProps,
  ListRenderItem,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
interface CarouselProps extends FlatListProps<any> {
  data: any[]
  renderItem: ListRenderItem<any>
  keyExtractor: (item: any, index: number) => string
  onScroll: ScrollViewProps['onScroll']
  sliderWidth: number
  itemWidth?: number
  autoplay?: boolean
  delay?: number
  placeholderHeight?: number
  showIndicator?: boolean
  indicatorType?: 'dot' | 'bar'
  indicatorContainerStyle?: StyleProp<ViewStyle>
  indicatorItemStyle?: ViewStyle
}
const Carousel = forwardRef(
  (
    {
      data,
      keyExtractor,
      renderItem,
      sliderWidth = screenWidth,
      itemWidth,
      placeholderHeight,
      showIndicator,
      indicatorType = 'dot',
      indicatorContainerStyle,
      indicatorItemStyle,
      autoplay = false,
      delay = 3000,
      ...restProps
    }: CarouselProps,
    ref,
  ) => {
    const listRef = useRef<any>()
    const scrollX = useSharedValue(0)
    const pageWidth = useMemo(
      () =>
        caculatePageWidthForPagination(
          sliderWidth,
          itemWidth || sliderWidth,
          data.length,
          0,
        ),
      [data],
    )
    useImperativeHandle(
      ref,
      () => ({
        scrollToIndex: (index: number) => {
          if (index >= 0 && index < data.length) {
            listRef.current?.scrollToIndex?.({ index })
            scrollX.value = withTiming(index * sliderWidth)
          }
        },
      }),
      [data],
    )

    useEffect(() => {
      if (autoplay) {
        const timer = setInterval(() => {
          const index = Math.floor(scrollX.value / sliderWidth)
          if (index >= data.length - 1) {
            listRef.current?.scrollToIndex?.({ index: 0 })
            scrollX.value = withTiming(0)
          } else {
            listRef.current?.scrollToIndex?.({ index: index + 1 })
            scrollX.value = withTiming((index + 1) * sliderWidth)
          }
        }, delay)
        return () => clearInterval(timer)
      }
    }, [data, autoplay])

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: ({ contentOffset: { x } }) => {
        scrollX.value = x
      },
    })

    const renderPageIndicator = useCallback(
      (_: any, index: number) => {
        return (
          <Indicator
            key={index}
            scrollX={scrollX}
            index={index}
            pageWidth={pageWidth}
            type={indicatorType}
            itemStyle={indicatorItemStyle}
          />
        )
      },
      [pageWidth],
    )
    return (
      <View
        style={{
          width: sliderWidth,
          height: placeholderHeight,
        }}
      >
        <Animated.FlatList
          {...restProps}
          onScroll={scrollHandler}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
          ref={listRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        {showIndicator && (
          <View style={[styles.baseIndicator, indicatorContainerStyle]}>
            {data.map(renderPageIndicator)}
          </View>
        )}
      </View>
    )
  },
)

export default memo(Carousel)

interface IndicatorProps {
  scrollX: Animated.SharedValue<number>
  itemStyle: ViewStyle
  type: 'dot' | 'bar'
  pageWidth: number
  index: number
}
const minIndicatorWidth = moderateScale(6)
const maxIndicatorWidth = moderateScale(16)
const Indicator = memo(
  ({ scrollX, itemStyle, type, pageWidth, index }: IndicatorProps) => {
    const isDot = type === 'dot'
    const inputRange = [
      (index - 1) * pageWidth,
      index * pageWidth,
      (index + 1) * pageWidth,
    ]
    const indicatorStyle = useAnimatedStyle(() => ({
      width: isDot
        ? interpolate(
            scrollX.value,
            inputRange,
            isDot
              ? [minIndicatorWidth, maxIndicatorWidth, minIndicatorWidth]
              : [0, pageWidth, 0],
            Extrapolation.CLAMP,
          )
        : maxIndicatorWidth,
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.25, 1, 0.25],
        Extrapolation.CLAMP,
      ),
    }))
    return (
      <Animated.View
        style={[styles.baseIndicatorItem, itemStyle, indicatorStyle]}
      />
    )
  },
)
const styles = XStyleSheet.create({
  baseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  baseIndicatorItem: {
    width: 6,
    height: 6,
    borderRadius: 99,
    marginHorizontal: 3,
  },
})
