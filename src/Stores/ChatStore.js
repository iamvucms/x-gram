import { mockConversations, mockMessages } from '@/Models'
import {
  deleteConversation,
  getConversations,
  getMessages,
} from '@/Services/Api'
import { makePersistExcept } from '@/Utils'
import { makeAutoObservable } from 'mobx'
import { hydrateStore, isHydrated } from 'mobx-persist-store'
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
  constructor() {
    makeAutoObservable(this)
    makePersistExcept(this, 'ChatStore', [])
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
  *sendMessage(conversationId, message) {}
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
  getConversationById(conversationId) {
    return this.conversations.find(
      item => item.conversation_id === (conversationId || this.conversationId),
    )
  }
  addMessage(conversationId, message) {
    if (this.conversationId === conversationId) {
      this.messages = [message, ...this.messages]
    }
  }
  updateLastMessage(conversationId, message) {
    const conversation = this.getConversationById(conversationId)
    if (conversation) {
      conversation.last_message = message
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
    this.messages = []
    this.messagePage = 1
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
