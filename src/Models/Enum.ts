export enum ShareType {
  Post = 'Post',
  Story = 'Story',
}

export enum Gender {
  Male = 0,
  Female = 1,
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
