import { Method, request } from '../Axios'
import Endpoint from '../Endpoint'

export const getConversations = page =>
  request(Endpoint().getConversations(page), Method.GET)

export const getMessages = (conversationId, page) =>
  request(Endpoint().getMessages(conversationId, page), Method.GET)

export const deleteConversation = conversationId =>
  request(Endpoint().deleteConversation(conversationId), Method.DELETE)

export const createConversation = user_id => {
  return request(Endpoint().createConversation, Method.POST, {
    user_id,
  })
}
