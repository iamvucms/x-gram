export enum ShareType {
  Post = 'Post',
  Story = 'Story',
}

export enum Gender {
  Male = 0,
  Female = 1,
  PreferNotToSay = 2,
}
export enum MediaType {
  Photo = 'photo',
  Video = 'video',
}
export enum CreateType {
  Post,
  Story,
  Reel,
}

export enum CommentStatus {
  SENDING,
  UPDATING,
  ERROR,
  ERROR_UPDATE,
  SENT,
}

export const PostStatus = CommentStatus
export enum MessageStatus {
  SENDING,
  ERROR,
  SENT,
  READ,
}
export enum MessageType {
  Text = 'text',
  Image = 'image',
  Sticker = 'sticker',
  Video = 'video',
}
export enum NotificationType {
  FOLLOW = 'follow',
  REACT = 'react',
  COMMENT = 'comment',
  MENTION_IN_COMMENT = 'mention_in_comment',
  MENTION_IN_POST = 'mention_in_post',
}
