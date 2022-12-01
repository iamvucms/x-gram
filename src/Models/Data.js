import { PhotoSvg, StackSvg, VideoSvg } from '@/Assets/Svg'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors } from '@/Theme'
import React from 'react'
import { CreateType, MediaType } from './Enum'

export const CreateOptions = [
  {
    icon: <PhotoSvg color={Colors.white} size={24} />,
    routeName: PageName.MediaPicker,
    params: {
      multiple: true,
      editable: true,
      type: MediaType.Photo,
      editorProps: {
        type: CreateType.Post,
        onNext: medias => navigate(PageName.CreatePost, { medias }),
      },
    },
    bgColor: Colors.kE5AFAF,
  },
  {
    icon: <VideoSvg color={Colors.white} size={24} />,
    routeName: PageName.MediaPicker,
    params: {
      multiple: true,
      editable: true,
      type: MediaType.Video,
      editorProps: {
        type: CreateType.Post,
        onNext: medias => navigate(PageName.CreatePost, { medias }),
      },
    },
    bgColor: Colors.kC4BCFF,
  },
  {
    icon: <StackSvg color={Colors.white} size={24} />,
    routeName: PageName.CreateFeatureScreen,
    bgColor: Colors.kC2D8BE,
  },
]
