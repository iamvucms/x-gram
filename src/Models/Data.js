import {
  ArchitectureSvg,
  ArtSvg,
  FashionSvg,
  FoodSvg,
  HammerSvg,
  LandscapeSvg,
  MaskSvg,
  PhotoSvg,
  StackSvg,
  VideoSvg,
} from '@/Assets/Svg'
import { PageName } from '@/Config'
import { navigate } from '@/Navigators'
import { Colors } from '@/Theme'
import React from 'react'
import { CreateType, FilterType, MediaType, PeopleFilterType } from './Enum'

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

export const TagFilterTypes = [
  {
    type: FilterType.Architecture,
    icon: ArchitectureSvg,
    name: 'search.architecture',
  },
  {
    type: FilterType.Art,
    icon: ArtSvg,
    name: 'search.art',
  },
  {
    type: FilterType.Cosplay,
    icon: MaskSvg,
    name: 'search.cosplay',
  },
  {
    type: FilterType.Decor,
    icon: HammerSvg,
    name: 'search.decor',
  },
  {
    type: FilterType.Food,
    icon: FoodSvg,
    name: 'search.food',
  },
  {
    type: FilterType.Fashion,
    icon: FashionSvg,
    name: 'search.fashion',
  },
  {
    type: FilterType.Landscape,
    icon: LandscapeSvg,
    name: 'search.landscape',
  },
  {
    type: FilterType.Video,
    icon: VideoSvg,
    name: 'search.clip',
  },
]
export const PeopleFilterTypes = [
  {
    type: PeopleFilterType.All,
    name: 'search.all',
  },
  {
    type: PeopleFilterType.Following,
    name: 'search.following',
  },
  {
    type: PeopleFilterType.Followers,
    name: 'search.followers',
  },
]
