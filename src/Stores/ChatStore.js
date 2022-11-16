import { Config } from '@/Config'
import {
  DrawColors,
  MessageStatus,
  mockConversations,
  mockMessages,
} from '@/Models'
import {
  deleteConversation,
  getConversations,
  getMessages,
} from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
import { io } from 'socket.io-client'
import { userStore } from '.'
export default class ChatStore {
  conversations = []
  messages = []
  onlineUsers = {}
  loadingConversations = false
  loadingMoreConversations = false
  loadingMessages = false
  loadingMoreMessages = false
  conversationPage = 1
  messagePage = 1
  conversationId = null
  socket = null
  themeColorIdx = 0
  themeBackgroundIdx = -1
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
        console.log('connected')
        resolve()
      })
      this.socket.on('disconnect', () => {
        console.log('disconnected')
      })
      this.socket.on('onlineUsers', onlineUsers => {
        this.setOnlineUsers(onlineUsers)
      })
      this.socket.on('newMessage', ({ message, conversation_id }) => {
        this.addMessage(conversation_id, message)
        this.updateLastMessage(message.conversation_id, message)
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
  *sendMessage(conversationId, message, retryId) {
    if (!this.socket) {
      // yield this.initSocket()
    }
    const msgId = retryId || Math.random()
    try {
      if (!retryId) {
        this.addMessage(
          conversationId,
          {
            ...message,
            message_id: msgId,
            status: MessageStatus.SENDING,
          },
          msgId,
        )
      } else {
        this.updateMessage(msgId, {
          status: MessageStatus.SENDING,
        })
      }
      setTimeout(() => {
        this.updateMessage(msgId, { status: MessageStatus.ERROR })
      }, 1000)
      this.socket.emit(
        'sendMessage',
        {
          conversation_id: conversationId,
          message,
        },
        response => {
          if (response?.status === 'OK') {
            this.updateMessage(msgId, {
              ...response?.data,
              status: MessageStatus.SENT,
            })
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
  deleteUnSentMessages(msgId) {
    this.messages = this.messages.filter(item => item.message_id !== msgId)
  }
  getConversationById(conversationId) {
    return this.conversations.find(
      item => item.conversation_id === (conversationId || this.conversationId),
    )
  }
  addMessage(conversationId, message) {
    if (this.conversationId === conversationId) {
      this.messages = [message, ...this.messages]
    }
    this.updateLastMessage(conversationId, message)
  }
  updateLastMessage(conversationId, message) {
    const conversation = this.getConversationById(conversationId)
    if (
      conversation &&
      conversation.last_message.message_id === message.message_id
    ) {
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
  }
  setOnlineUsers(onlineUsers) {
    this.onlineUsers = onlineUsers
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
    this.themeColorIdx = index
  }
  setThemeBackgroundIndex(index) {
    this.themeBackgroundIdx = index
  }
  get unreadConversationCount() {
    return this.conversations.filter(
      item =>
        item.last_message?.sent_by?.user_id !== userStore.userInfo?.user_id &&
        item.status !== MessageStatus.READ,
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
