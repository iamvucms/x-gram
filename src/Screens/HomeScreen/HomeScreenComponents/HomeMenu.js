import { BellSvg, MenuSvg, MessageSvg } from '@/Assets/Svg'
import { Box } from '@/Components'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors, XStyleSheet } from '@/Theme'
import { isAndroid } from '@/Utils'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const HomeMenu = () => {
  return (
    <Box
      backgroundColor={Colors.k222222}
      row
      justify="space-between"
      align="center"
      paddingTop={isAndroid ? 15 : 0}
      paddingHorizontal={20}
      paddingBottom={24}
    >
      <TouchableOpacity>
        <MenuSvg color={Colors.white} />
      </TouchableOpacity>
      <Box
        row
        align="center"
        paddingVertical={3}
        backgroundColor={Colors.white006}
        radius={999}
      >
        <TouchableOpacity style={styles.headerBtn}>
          <BellSvg color={Colors.k8E8E8E} size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate(PageName.ConversationsScreen)}
          activeOpacity={0.8}
          style={[styles.headerBtn, { backgroundColor: Colors.white }]}
        >
          <MessageSvg color={Colors.k8E8E8E} size={25} />
        </TouchableOpacity>
      </Box>
    </Box>
  )
}

export default HomeMenu

const styles = XStyleSheet.create({
  headerBtn: {
    width: 73,
    height: 49,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
