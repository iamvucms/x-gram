export enum ShareType {
  Post = 'Post',
  Story = 'Story',
}

export enum Gender {
  Male = 0,
  Female = 1,
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
  SENT,
}

export const PostStatus = CommentStatus
