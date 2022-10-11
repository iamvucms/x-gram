import { PhotoSvg } from '@/Assets/Svg'
import { PageName } from '@/Config'
import { Colors } from '@/Theme'
import React from 'react'

export const CreateOptions = [
  {
    icon: <PhotoSvg color={Colors.white} size={24} />,
    routeName: PageName.CreatePhotoScreen,
    params: {
      type: 'photo',
    },
    bgColor: Colors.kE5AFAF,
  },
  {
    icon: null,
    routeName: 'Capture',
    params: {
      type: 'video',
    },
    bgColor: Colors.kC4BCFF,
  },
  {
    icon: null,
    routeName: 'CreateAlbum',
    bgColor: Colors.kC2D8BE,
  },
]
