import { Config } from '@/Config'
import {
  DrawColors,
  MessageStatus,
  mockConversations,
  mockMessages,
  Conversation,
  Message,
  MessageType,
} from '@/Models'
import {
  deleteConversation,
  getConversations,
  getMessages,
  createConversation,
  uploadImage,
} from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
import { io } from 'socket.io-client'
import { chatStore, diaLogStore, userStore } from '.'
export default class ChatStore {
  conversations: Conversation[] = []
  messages: Message[] = []
  onlineUsers = {}
  loadingConversations = false
  loadingMoreConversations = false
  loadingMessages = false
  loadingMoreMessages = false
  conversationPage = 1
  messagePage = 1
  conversationId = null
  socket = null
  themeColorIdxes: { [key: string]: number } = {}
  themeBackgroundIdxes: { [key: string]: number } = {}
  constructor() {
    makeAutoObservable(this)
    makePersistExcept(this, 'ChatStore', [
      'socket',
      'onlineUsers',
      'loadingConversations',
      'loadingMoreConversations',
      'loadingMessages',
      'loadingMoreMessages',
      'conversationPage',
      'messagePage',
    ])
  }
  initSocket() {
    return new Promise(resolve => {
      this.socket = io(Config.SOCKET_URL, {
        autoConnect: true,
        timeout: 10000,
      })
      this.socket.on('connect', () => {
        this.socket.emit('onConnection', {
          id: userStore.userInfo.user_id,
        })
        resolve(true)
      })
      this.socket.on('getUserOnline', onlineUids => {
        const obj = {}
        for (const id of onlineUids) {
          obj[id] = true
        }
        this.setOnlineUsers(obj)
      })
      this.socket.on('userDisconnected', uid => {
        this.removeOnlineUser(uid)
      })
      this.socket.on('userConnected', uid => {
        console.log({ uid })
        this.addOnlineUser(uid)
      })
      this.socket.on('disconnect', () => {
        console.log('disconnected')
      })
      this.socket.on('newMessage', message => {
        this.addMessage(message.conversation_id, message)
        this.updateLastMessage(message.conversation_id, message)
      })
      this.socket.on('seenMessage', message => {
        this.updateMessage(message.message_id, message)
      })
      this.socket.on(
        'messageStatus',
        ({ conversation_id, message_id, status }) => {
          this.updateMessage(message_id, { status })
          this.updateLastMessage(conversation_id, { message_id, status })
        },
      )
    })
  }
  *fetchConversations(loadMore = false) {
    this[loadMore ? 'loadingMoreConversations' : 'loadingConversations'] = true
    try {
      const response = yield getConversations(
        loadMore ? this.conversationPage + 1 : 1,
      )
      if (response.status === 'OK') {
        this.conversations = response.data
        this.conversationPage += 1
      }
    } catch (e) {
      this.conversations = mockConversations //TODO: remove mock data
      console.log({
        fetchConversations: e,
      })
    }
    this[loadMore ? 'loadingMoreConversations' : 'loadingConversations'] = false
  }
  *fetchMessages(conversationId, loadMore = false) {
    this.conversationId = conversationId
    this[loadMore ? 'loadingMoreMessages' : 'loadingMessages'] = true
    try {
      const response = yield getMessages(
        conversationId,
        loadMore ? this.messagePage + 1 : 1,
      )
      if (response.status === 'OK') {
        this.messages = response.data
        this.messagePage += 1
      }
    } catch (e) {
      this.messages = mockMessages //TODO: remove mock data
      console.log({
        fetchMessages: e,
      })
    }
    this[loadMore ? 'loadingMoreMessages' : 'loadingMessages'] = false
  }
  *createConversation(userId) {
    try {
      const response = yield createConversation(userId)
      if (response.status === 'OK') {
        this.conversations = [response.data, ...this.conversations]
        return response.data
      }
    } catch (e) {
      diaLogStore.showErrorDiaLog({
        message: e,
      })
      console.log({
        createNewConversation: e,
      })
    }
  }
  *sendMessage(
    conversationId: string,
    message: Partial<Message>,
    retryId?: string,
  ) {
    if (!this.socket) {
      // yield this.initSocket()
    }
    const msgId = retryId || Math.random()
    try {
      if (!retryId) {
        this.addMessage(conversationId, {
          ...message,
          message_id: msgId,
          status: MessageStatus.SENDING,
        })
      } else {
        this.updateMessage(msgId, {
          status: MessageStatus.SENDING,
        })
      }
      //upload image
      if (message.type === MessageType.Image) {
        const response = yield uploadImage(message.message)
        if (response.status === 'OK') {
          message.message = response.data[0].url
        } else {
          this.updateMessage(msgId, { status: MessageStatus.ERROR })
          return
        }
      }
      this.socket.emit(
        'sendMessage',
        {
          ...message,
          sent_by: userStore.userInfo.user_id,
          sent_to: this.getConversationById(conversationId).user.user_id,
        },
        response => {
          if (response?.status === 'OK') {
            this.updateMessage(msgId, {
              ...response?.data,
              status: MessageStatus.SENT,
            })
            this.updateLastMessage(conversationId, response.data)
          } else {
            this.updateMessage(msgId, {
              status: MessageStatus.ERROR,
            })
          }
        },
      )
    } catch (e) {
      this.updateMessage(msgId, { status: MessageStatus.ERROR })
      console.log({ sendMessage: e })
    }
  }
  *markMessageAsSeen(messageId) {
    try {
      this.socket.emit(
        'seenMessage',
        {
          message_id: messageId,
        },
        response => {
          if (response?.status === 'OK') {
            this.updateMessage(messageId, response?.data)
          }
        },
      )
    } catch (e) {
      console.log({ markMessageAsSeen: e })
    }
  }
  *sendNewMessage(userId: string, message: Partial<Message>) {
    try {
      const conversation = this.conversations.find(
        x => x.user.user_id === userId,
      )
      console.log({ conversation })
      if (conversation) {
        this.sendMessage(conversation.conversation_id, message)
      } else {
        const newConversation = yield this.createConversation(userId)
        if (newConversation) {
          this.sendMessage(newConversation.conversation_id, message)
        }
      }
    } catch (e) {
      console.log({ sendReferralMessage: e })
    }
  }
  *deleleConversation(conversationId) {
    try {
      this.conversations = this.conversations.filter(
        item => item.conversation_id !== conversationId,
      )
      const response = yield deleteConversation(conversationId)
      if (response.status !== 'OK') {
        console.log({ deleteConversation: 'error' })
      }
    } catch (e) {
      console.log({
        deleleConversation: e,
      })
    }
  }
  addEmptyConversation(user) {
    this.conversations.unshift({
      conversation_id: `${Math.random()}`,
      last_message: {
        message_id: `${Math.random()}`,
        message: '',
        status: MessageStatus.SENDING,
      },
      user,
    } as any)
  }
  deleteUnSentMessages(msgId) {
    this.messages = this.messages.filter(item => item.message_id !== msgId)
  }
  getConversationById(conversationId) {
    return this.conversations.find(
      item => item.conversation_id === (conversationId || this.conversationId),
    )
  }
  getConversationByUserId(userId) {
    return this.conversations.find(item => item.user.user_id === userId)
  }
  addMessage(conversationId, message) {
    if (this.conversationId === conversationId) {
      this.messages = [message, ...this.messages]
    }
    this.updateLastMessage(conversationId, message)
  }
  updateLastMessage(conversationId, message) {
    const conversation = this.getConversationById(conversationId)
    if (conversation) {
      conversation.last_message = { ...conversation.last_message, ...message }
    }
  }
  updateMessage(messageId, message) {
    const index = this.messages.findIndex(item => item.message_id === messageId)
    if (index !== -1) {
      this.messages[index] = {
        ...this.messages[index],
        ...message,
      }
    }
    //update last message
    const lastMessageIndex = this.conversations.findIndex(
      item => item.last_message.message_id === messageId,
    )
    if (lastMessageIndex !== -1) {
      this.conversations[lastMessageIndex].last_message = {
        ...this.conversations[lastMessageIndex].last_message,
        ...message,
      }
    }
  }
  setOnlineUsers(onlineUsers) {
    this.onlineUsers = onlineUsers
  }
  addOnlineUser(userId) {
    this.onlineUsers[userId] = true
  }
  removeOnlineUser(userId) {
    delete this.onlineUsers[userId]
  }
  resetOnlineUsers() {
    this.onlineUsers = {}
  }
  getIsOnline(userId) {
    return !!this.onlineUsers[userId]
  }
  resetMessages() {
    this.conversationId = null
    this.messages = []
    this.messagePage = 1
  }
  setThemeColorIndex(index) {
    this.themeColorIdxes[this.conversationId] = index
  }
  setThemeBackgroundIndex(index) {
    this.themeBackgroundIdxes[this.conversationId] = index
  }
  get themeColorIdx() {
    return this.themeColorIdxes[this.conversationId] || 0
  }
  get themeBackgroundIdx() {
    return this.themeBackgroundIdxes[this.conversationId] || -1
  }
  get unreadConversationCount() {
    return this.conversations.filter(
      item =>
        item.last_message?.sent_by?.user_id !== userStore.userInfo?.user_id &&
        item.last_message.status !== MessageStatus.READ,
    ).length
  }
  get themeColors() {
    const color = DrawColors[this.themeColorIdx]
    return Array.isArray(color) ? color : [color, color]
  }
  // check for hydration (required)
  get isHydrated() {
    return isHydrated(this)
  }
  // hydrate the store (required)
  async hydrateStore() {
    await hydrateStore(this)
  }
}
