import {
  moderateScale,
  ResponsiveWidth,
  screenWidth,
  XStyleSheet,
} from '@/Theme'
import React from 'react'
import { Pressable } from 'react-native'
import AppImage from './AppImage'
interface PostGridItemProps {
  post: any
}
const PostGridItem = ({ post }: PostGridItemProps) => {
  return (
    <Pressable style={styles.rootView}>
      <AppImage
        source={{
          uri: post.medias[0].url,
        }}
      />
    </Pressable>
  )
}

export default PostGridItem

const styles = XStyleSheet.create({
  rootView: {
    skipResponsive: true,
    width: (screenWidth - ResponsiveWidth(40)) / 3,
    aspectRatio: 1,
    height: undefined,
    marginLeft: ResponsiveWidth(10),
    marginBottom: ResponsiveWidth(10),
    backgroundColor: 'red',
    borderRadius: moderateScale(6),
    overflow: 'hidden',
  },
})
