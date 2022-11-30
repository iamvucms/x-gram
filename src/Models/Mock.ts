import { generateRandomIntegerInRange } from '@/Utils'
import { Gender, MessageStatus, NotificationType } from './Enum'
export const mockUsers = [
  {
    user_id: 'username01',
    full_name: 'John Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Male,
  },
  {
    user_id: 'username02',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username03',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username04',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username05',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username06',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username07',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username08',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username09',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
  {
    user_id: 'username10',
    full_name: 'Jane Doe',
    avatar_url: `https://picsum.photos/${generateRandomIntegerInRange(
      300,
      500,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    cover_url: `https://picsum.photos/${generateRandomIntegerInRange(
      1000,
      2000,
    )}/${generateRandomIntegerInRange(300, 500)}`,
    bio: 'This is a bio',
    email: 'vucms@gmail.com',
    phone_number: '0777888999',
    date_of_birth: '2000-01-01',
    websites: ['https://google.com', 'https://facebook.com'],
    followers: [],
    following: [],
    gender: Gender.Female,
  },
]
export const mockComments = [
  {
    comment_id: '1',
    created_at: new Date().getTime(),
    commented_by: mockUsers[0],
    comment: '@username This is a comment by John Doe',
  },
  {
    comment_id: '2',
    created_at: new Date().getTime(),
    commented_by: mockUsers[1],
    comment:
      'This is a comment by Jane Doe. This is a comment by Jane Doe .This is a comment by Jane Doe This is a comment by Jane Doe ',
  },
  {
    comment_id: '3',
    created_at: new Date().getTime(),
    commented_by: mockUsers[2],
    comment:
      '@username03 This is a comment by Jane Doe. This is a comment by Jane Doe .This is a comment by Jane Doe This is a comment by Jane Doe ',
  },
  {
    comment_id: '4',
    created_at: new Date().getTime(),
    commented_by: mockUsers[3],
    comment:
      'This is a comment by Jane Doe. This is a comment by Jane Doe .This is a comment by Jane Doe This is a comment by Jane Doe ',
  },
  {
    comment_id: '5',
    created_at: new Date().getTime(),
    commented_by: mockUsers[4],
    comment:
      'This is a comment by Jane Doe. This is a comment by Jane Doe .This is a comment by Jane Doe This is a comment by Jane Doe ',
  },
  {
    comment_id: '6',
    created_at: new Date().getTime(),
    commented_by: mockUsers[5],
    comment:
      '@username04 This is a comment by Jane Doe. This is a comment by Jane Doe .This is a comment by Jane Doe This is a comment by Jane Doe ',
  },
  {
    comment_id: '7',
    created_at: new Date().getTime(),
    commented_by: mockUsers[6],
    comment:
      'This is a comment by Jane Doe. This is a comment by Jane Doe .This is a comment by Jane Doe This is a comment by Jane Doe ',
  },
  {
    comment_id: '8',
    created_at: new Date().getTime(),
    commented_by: mockUsers[7],
    comment:
      '@username04 This is a comment by Jane Doe. This is a comment by Jane Doe .This is a comment by Jane Doe This is a comment by Jane Doe ',
  },
  {
    comment_id: '9',
    created_at: new Date().getTime(),
    commented_by: mockUsers[7],
    comment: 'https://picsum.photos/200/300',
    is_image: true,
  },
]

export const mockPosts = [
  {
    post_id: '1',
    posted_by: mockUsers[0],
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    message: 'This is a post by John Doe',
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
    ],
    reactions: [
      {
        reacted_by: mockUsers[0],
      },
      {
        reacted_by: mockUsers[1],
      },
    ],
    comments: mockComments,
  },
  {
    post_id: '15',
    posted_by: mockUsers[0],
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    message: 'This is a post by John Doe',
    medias: [
      {
        media_id: '1',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        is_video: true,
      },
    ],
    reactions: [
      {
        reacted_by: mockUsers[0],
      },
      {
        reacted_by: mockUsers[1],
      },
    ],
    comments: mockComments,
  },
  {
    post_id: '2',
    posted_by: mockUsers[0],
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    message: 'This is a post by John Doe',
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
    ],
    reactions: [
      {
        reacted_by: mockUsers[0],
      },
      {
        reacted_by: mockUsers[1],
      },
    ],
    comments: mockComments,
  },
  {
    post_id: '3',
    posted_by: mockUsers[0],
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    message: 'This is a post by John Doe',
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
    ],
    reactions: [
      {
        reacted_by: mockUsers[0],
      },
      {
        reacted_by: mockUsers[1],
      },
    ],
    comments: mockComments,
  },
  {
    post_id: '4',
    posted_by: mockUsers[0],
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    message: 'This is a post by John Doe',
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
    ],
    reactions: [
      {
        reacted_by: mockUsers[0],
      },
      {
        reacted_by: mockUsers[1],
      },
    ],
    comments: mockComments,
  },
  {
    post_id: '5',
    posted_by: mockUsers[0],
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    message: 'This is a post by John Doe',
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
    ],
    reactions: [
      {
        reacted_by: mockUsers[0],
      },
      {
        reacted_by: mockUsers[1],
      },
    ],
    comments: mockComments,
  },
  {
    post_id: '6',
    posted_by: mockUsers[0],
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    message: 'This is a post by John Doe',
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
      },
    ],
    reactions: [
      {
        reacted_by: mockUsers[0],
      },
      {
        reacted_by: mockUsers[1],
      },
    ],
    comments: mockComments,
  },
]

export const mockStories = [
  {
    story_id: '1',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
      {
        media_id: '3',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
    ],
    posted_by: mockUsers[0],
  },
  {
    story_id: '2',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
    ],
    posted_by: mockUsers[1],
  },
  {
    story_id: '3',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
    ],
    posted_by: mockUsers[2],
  },
  {
    story_id: '4',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    medias: [
      {
        media_id: '1',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
      {
        media_id: '2',
        url:
          'https://picsum.photos/' +
          generateRandomIntegerInRange(800, 2000) +
          '/' +
          generateRandomIntegerInRange(800, 2000) +
          '',
        is_video: false,
        created_at: new Date().getTime(),
      },
    ],
    posted_by: mockUsers[3],
  },
]
export const mockMessages = [
  {
    message_id: '1',
    message: 'Hello',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'text',
    sent_by: mockUsers[0],
  },
  {
    message_id: '2',
    message: 'Hi',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'text',
    sent_by: mockUsers[1],
  },
  {
    message_id: '3',
    message: 'How are you?',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'text',
    sent_by: mockUsers[0],
  },
  {
    message_id: '4',
    message: 'I am fine',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'text',
    sent_by: mockUsers[1],
  },
  {
    message_id: '5',
    message: 'What about you?',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'text',
    sent_by: mockUsers[0],
  },
  {
    message_id: '6',
    message: 'I am also fine',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'text',
    sent_by: mockUsers[1],
  },
  {
    message_id: '7',
    message: 'https://picsum.photos/2000/3000',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'image',
    sent_by: mockUsers[0],
  },
  {
    message_id: '8',
    message: '22',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'sticker',
    sent_by: mockUsers[1],
  },
  {
    message_id: '9',
    message: 'https://picsum.photos/2001/3000',
    status: MessageStatus.READ,
    created_at: new Date().getTime(),
    type: 'image',
    sent_by: mockUsers[0],
  },
]
export const mockConversations = [
  {
    conversation_id: '1',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[0],
    user: mockUsers[0],
  },
  {
    conversation_id: '2',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[1],
  },
  {
    conversation_id: '3',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[2],
  },
  {
    conversation_id: '4',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[3],
  },
  {
    conversation_id: '5',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[4],
  },
  {
    conversation_id: '6',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[4],
  },
  {
    conversation_id: '7',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[4],
  },
  {
    conversation_id: '8',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[4],
  },
  {
    conversation_id: '9',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[4],
  },
  {
    conversation_id: '10',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[4],
  },
  {
    conversation_id: '11',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[8],
  },
  {
    conversation_id: '12',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[7],
  },
  {
    conversation_id: '13',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[5],
  },
  {
    conversation_id: '14',
    created_at: new Date().getTime(),
    updated_at: new Date().getTime(),
    last_message: mockMessages[1],
    user: mockUsers[6],
  },
]
export const mockNotifications = [
  {
    notification_id: '1',
    created_at: new Date().getTime(),
    type: NotificationType.COMMENT,
    user: mockUsers[1],
    reference: mockComments[0],
    post_id: mockPosts[0].post_id,
  },
  {
    notification_id: '2',
    created_at: new Date().getTime(),
    type: NotificationType.REACT,
    user: mockUsers[1],
    reference: mockPosts[0],
    post_id: mockPosts[0].post_id,
  },
  {
    notification_id: '3',
    created_at: new Date().getTime(),
    type: NotificationType.FOLLOW,
    user: mockUsers[1],
    reference: mockUsers[1],
  },
  {
    notification_id: '4',
    created_at: new Date().getTime(),
    type: NotificationType.COMMENT,
    user: mockUsers[1],
    reference: mockComments[0],
    post_id: mockPosts[0].post_id,
  },
  {
    notification_id: '5',
    created_at: new Date().getTime(),
    type: NotificationType.REACT,
    user: mockUsers[1],
    reference: mockPosts[0],
    post_id: mockPosts[0].post_id,
  },
  {
    notification_id: '6',
    created_at: new Date().getTime(),
    type: NotificationType.FOLLOW,
    user: mockUsers[1],
    reference: mockUsers[1],
  },
  {
    notification_id: '7',
    created_at: new Date().getTime(),
    type: NotificationType.MENTION_IN_COMMENT,
    user: mockUsers[1],
    reference: mockComments[0],
    post_id: mockPosts[0].post_id,
  },
  {
    notification_id: '8',
    created_at: new Date('2020-01-01').getTime(),
    type: NotificationType.MENTION_IN_POST,
    user: mockUsers[1],
    reference: mockPosts[0],
    post_id: mockPosts[0].post_id,
  },
  {
    notification_id: '9',
    created_at: new Date('2020-02-01').getTime(),
    type: NotificationType.FOLLOW,
    user: mockUsers[1],
    reference: mockUsers[1],
  },
]
export type Post = typeof mockPosts[0]
export type Message = typeof mockMessages[0]
export type Conversation = typeof mockConversations[0]
export type User = typeof mockUsers[0]
export type Comment = typeof mockComments[0]
type PreNotification = typeof mockNotifications[0]
export type Notification = PreNotification &
  (
    | {
        type: NotificationType.COMMENT | NotificationType.MENTION_IN_COMMENT
        reference: Comment
      }
    | {
        type: NotificationType.REACT | NotificationType.MENTION_IN_POST
        reference: Post
      }
    | {
        type: NotificationType.FOLLOW
        reference?: undefined
        post_id?: undefined
      }
  )
