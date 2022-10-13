import { PhotoSvg, VideoSvg } from '@/Assets/Svg'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors } from '@/Theme'
import React from 'react'

export const CreateOptions = [
  {
    icon: <PhotoSvg color={Colors.white} size={24} />,
    routeName: PageName.MediaPicker,
    params: {
      type: 'photo',
      onNext: medias => {
        navigate(PageName.CreatePost, { medias })
      },
    },
    bgColor: Colors.kE5AFAF,
  },
  {
    icon: <VideoSvg color={Colors.white} size={24} />,
    routeName: PageName.MediaPicker,
    params: {
      type: 'video',
      onNext: medias => {
        navigate(PageName.CreatePost, { medias, isVideo: true })
      },
    },
    bgColor: Colors.kC4BCFF,
  },
  {
    icon: null,
    routeName: 'CreateAlbum',
    bgColor: Colors.kC2D8BE,
  },
]
