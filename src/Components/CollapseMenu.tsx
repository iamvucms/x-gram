import { ChevronDownSvg } from '@/Assets/Svg'
import { Colors, XStyleSheet } from '@/Theme'
import { autorun } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  ListRenderItem,
  Pressable,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Collapsible, { CollapsibleProps } from 'react-native-collapsible'
import { FlatList } from 'react-native-gesture-handler'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Obx } from '.'
import AppText from './AppText'
type MenuItem = {
  label: string
  value: string
  icon?: ImageSourcePropType
}
interface CollapseMenuProps extends CollapsibleProps {
  collapse: boolean
  data: MenuItem[]
  value: string
  title: string
  headerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  titleIcon?: ImageSourcePropType
  titleIconStyle?: StyleProp<ImageStyle>
  containerStyle?: StyleProp<ViewStyle>
  maxHeight?: number
  renderItem?: ListRenderItem<MenuItem>
  itemStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  iconStyle?: StyleProp<ImageStyle>
  iconDirection?: 'left' | 'right'
  customArrow?: (collapse: boolean) => JSX.Element
  onPress: (value: string) => void
}
const CollapseMenu = forwardRef(
  (
    {
      title,
      titleStyle,
      titleIcon,
      titleIconStyle,
      headerStyle,
      collapse,
      data,
      onPress,
      value,
      maxHeight,
      renderItem,
      itemStyle,
      labelStyle,
      iconStyle,
      iconDirection = 'left',
      customArrow,
      ...restProps
    }: CollapseMenuProps,
    ref,
  ) => {
    const listRef = useRef<FlatList>()
    const arrowAnim = useSharedValue(0)
    const state = useLocalObservable(() => ({
      data,
      setData: payload => (state.data = payload),
      collapsed: false,
      setCollapsed: (payload: boolean) => (state.collapsed = payload),
      value: value || data[0],
      setValue: (payload: string) => (state.value = payload),
    }))

    useEffect(() => {
      state.setData(data)
      const dispose = autorun(() => {
        arrowAnim.value = withTiming(state.collapsed ? 0 : 1)
      })
      return () => dispose()
    }, [data])

    useImperativeHandle(ref, () => ({
      collapse: () => state.setCollapsed(true),
      expand: () => state.setCollapsed(false),
    }))

    const arrowStyle = useAnimatedStyle(() => ({
      transform: [
        {
          rotate: `${interpolate(
            arrowAnim.value,
            [0, 1],
            [0, 180],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    }))

    const _renderItem = useCallback(({ item, index }) => {
      return (
        <TouchableOpacity
          style={[
            styles.baseItem,
            {
              flexDirection: iconDirection === 'left' ? 'row' : 'row-reverse',
            },
            itemStyle,
          ]}
          onPress={() => {
            state.setValue(item.value)
            onPress && onPress(item.value)
          }}
        >
          {!!item.icon && <Image style={styles.baseIcon} source={item.icon} />}
          <AppText style={(styles.baseLabel, labelStyle)}>{item.label}</AppText>
        </TouchableOpacity>
      )
    }, [])

    return (
      <View>
        <Pressable
          style={[styles.baseHeader, headerStyle]}
          onPress={() => state.setCollapsed(!state.collapsed)}
        >
          {!!titleIcon && (
            <Image
              style={[styles.baseIcon, titleIconStyle]}
              source={titleIcon}
            />
          )}
          <AppText style={[styles.baseTitle, titleStyle]}>{title}</AppText>
          <Obx>
            {() =>
              !!customArrow ? (
                customArrow(state.collapsed)
              ) : (
                <Animated.View style={arrowStyle}>
                  <ChevronDownSvg color={Colors.white} size={14} />
                </Animated.View>
              )
            }
          </Obx>
        </Pressable>
        <Obx>
          {() => (
            <Collapsible {...restProps} collapsed={state.collapsed}>
              <FlatList
                style={[maxHeight && { height: maxHeight }]}
                bounces={false}
                ref={listRef}
                data={data}
                renderItem={renderItem || _renderItem}
                keyExtractor={item => item.value}
                showsVerticalScrollIndicator={false}
              />
            </Collapsible>
          )}
        </Obx>
      </View>
    )
  },
)

export default memo(CollapseMenu)

const styles = XStyleSheet.create({
  baseItem: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: Colors.gray,
    alignItems: 'center',
  },
  baseLabel: {},
  baseIcon: {
    height: 20,
    width: 20,
  },
  baseTitle: {
    color: Colors.white,
  },
  baseHeader: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
