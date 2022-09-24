/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useMemo } from 'react'

import { TouchableOpacity, View } from 'react-native'

import { AppFonts, Colors, XStyleSheet } from '@/Theme'

import AppText from './AppText'

function BankRenderListItem({
  rtl,
  item,
  label,
  value,
  parent,
  selectable,
  disabled,
  custom,
  isSelected,
  IconComponent,
  TickIconComponent,
  listItemContainerStyle,
  listItemLabelStyle,
  listChildContainerStyle,
  listParentContainerStyle,
  listChildLabelStyle,
  listParentLabelStyle,
  customItemContainerStyle,
  customItemLabelStyle,
  selectedItemContainerStyle,
  selectedItemLabelStyle,
  disabledItemContainerStyle,
  disabledItemLabelStyle,
  categorySelectable,
  placeholderStyle,
  onPress,
  THEME,
}) {
  /**
   * The tick icon component.
   * @returns {JSX|null}
   */
  const _TickIconComponent = useMemo(
    () => isSelected && <TickIconComponent />,
    [isSelected, TickIconComponent],
  )

  /**
   * The list category container style.
   * @returns {object}
   */
  const _listParentChildContainerStyle = useMemo(
    () =>
      parent !== null
        ? [THEME.listChildContainer, ...[listChildContainerStyle].flat()]
        : [THEME.listParentContainer, ...[listParentContainerStyle].flat()],
    [THEME, rtl, listChildContainerStyle, listParentContainerStyle, parent],
  )

  /**
   * The selected item container style.
   * @returns {object}
   */
  const _selectedItemContainerStyle = useMemo(
    () => isSelected && selectedItemContainerStyle,
    [isSelected, selectedItemContainerStyle],
  )

  /**
   * The disabled item container style.
   * @returns {object}
   */
  const _disabledItemContainerStyle = useMemo(
    () => disabled && disabledItemContainerStyle,
    [disabled, disabledItemContainerStyle],
  )

  /**
   * The custom container item style.
   * @returns {JSX}
   */
  const _customItemContainerStyle = useMemo(
    () =>
      custom && [
        THEME.customItemContainer,
        ...[customItemContainerStyle].flat(),
      ],
    [THEME, custom, customItemContainerStyle],
  )

  /**
   * The list item container style.
   * @returns {object}
   */
  const _listItemContainerStyle = useMemo(
    () => [
      ...[listItemContainerStyle].flat(),
      ...[_listParentChildContainerStyle].flat(),
      ...[_selectedItemContainerStyle].flat(),
      ...[_customItemContainerStyle].flat(),
      ...[_disabledItemContainerStyle].flat(),
    ],
    [
      listItemContainerStyle,
      _listParentChildContainerStyle,
      _selectedItemContainerStyle,
      _customItemContainerStyle,
      _disabledItemContainerStyle,
    ],
  )

  /**
   * The list category label style.
   * @returns {object}
   */
  const _listParentChildLabelStyle = useMemo(
    () =>
      parent !== null
        ? [THEME.listChildLabel, ...[listChildLabelStyle].flat()]
        : [THEME.listParentLabel, ...[listParentLabelStyle].flat()],
    [THEME, listChildLabelStyle, listParentLabelStyle, parent],
  )

  /**
   * The selected item label style.
   * @returns {object}
   */
  const _selectedItemLabelStyle = useMemo(
    () => isSelected && selectedItemLabelStyle,
    [isSelected, selectedItemLabelStyle],
  )

  /**
   * The disabled item label style.
   * @returns {object}
   */
  const _disabledItemLabelStyle = useMemo(
    () => disabled && disabledItemLabelStyle,
    [disabled, disabledItemLabelStyle],
  )

  /**
   * The custom label item style.
   * @returns {JSX}
   */
  const _customItemLabelStyle = useMemo(
    () => custom && [THEME.customItemLabel, ...[customItemLabelStyle].flat()],
    [THEME, custom, customItemLabelStyle],
  )

  /**
   * The list item label style.
   * @returns {object}
   */
  const _listItemLabelStyle = useMemo(
    () => [
      ...[listItemLabelStyle].flat(),
      ...[_listParentChildLabelStyle].flat(),
      ...[_selectedItemLabelStyle].flat(),
      ...[_customItemLabelStyle].flat(),
      ...[_disabledItemLabelStyle].flat(),
    ],
    [
      listItemLabelStyle,
      _listParentChildLabelStyle,
      _selectedItemLabelStyle,
      _customItemLabelStyle,
      _disabledItemLabelStyle,
    ],
  )

  /**
   * onPress.
   */
  const __onPress = useCallback(() => {
    if (parent === null && !categorySelectable && selectable !== true) {
      return
    }

    onPress(item, custom)
  }, [onPress, parent, categorySelectable, custom])

  return value === '-999' ? (
    <View />
  ) : (
    <TouchableOpacity
      style={[
        _listItemContainerStyle,
        item.testID % 2 === 0 ? styles.oldItem : styles.eveItem,
      ]}
      onPress={__onPress}
      disabled={selectable === false || disabled}
    >
      <AppText
        style={[_listItemLabelStyle, styles.textStyle]}
      >{`${label}`}</AppText>
      {_TickIconComponent}
    </TouchableOpacity>
  )
}

const styles = XStyleSheet.create({
  selectedView: {
    backgroundColor: Colors.black,
    opacity: 0.1,
  },
  oldItem: {
    backgroundColor: Colors.white,
  },
  eveItem: {
    backgroundColor: Colors.kEBECED,
  },
  textStyle: {
    color: Colors.black,
    fontSize: 13,
    paddingLeft: 10,
  },
  iconStyle: {
    height: 30,
    width: 30,
    marginRight: 8,
    marginLeft: 10,
  },
})

const areEqual = (nextProps, prevProps) => {
  if (nextProps.label !== prevProps.label) {
    return false
  }
  if (nextProps.value !== prevProps.value) {
    return false
  }
  if (nextProps.parent !== prevProps.parent) {
    return false
  }
  if (nextProps.selectable !== prevProps.selectable) {
    return false
  }
  if (nextProps.disabled !== prevProps.disabled) {
    return false
  }
  if (nextProps.custom !== prevProps.custom) {
    return false
  }
  if (nextProps.isSelected !== prevProps.isSelected) {
    return false
  }
  if (nextProps.categorySelectable !== prevProps.categorySelectable) {
    return false
  }
  if (nextProps.rtl !== prevProps.rtl) {
    return false
  }
  if (nextProps.theme !== prevProps.theme) {
    return false
  }

  return true
}

export default memo(BankRenderListItem, areEqual)
