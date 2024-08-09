import MessageNotFoundException from '#exceptions/message_not_found_exception'
import Message from '#models/message'
import User from '#models/user'
import { createMessageValidator, updateMessageValidator } from '#validators/message'
import { RequestValidator } from '@adonisjs/core/http'
import { I18n } from '@adonisjs/i18n'

export default class MessageService {
  async findAllMessagesFromUser(user: User) {
    return await Message.query().where('receiver_id', user.id).orWhere('sender_id', user.id).exec()
  }

  async findAllMessagesFromUserSerialized(user: User) {
    const messages = await this.findAllMessagesFromUser(user)
    return messages.map((message) => message.serialize())
  }

  async findMessageById(id: number) {
    return await Message.find(id)
  }

  async findMessageByIdOrFail(id: number) {
    const message = await this.findMessageById(id)
    if (!message) {
      throw new MessageNotFoundException()
    }
    return message
  }

  async validateMessageCreation(request: RequestValidator, i18n: I18n) {
    return await request.validateUsing(createMessageValidator, {
      messagesProvider: i18n.createMessagesProvider(),
    })
  }

  async validateMessageUpdate(request: RequestValidator, i18n: I18n) {
    return await request.validateUsing(updateMessageValidator, {
      messagesProvider: i18n.createMessagesProvider(),
    })
  }

  async updateMessage(message: Message, request: RequestValidator, i18n: I18n) {
    return await message.merge(await this.validateMessageUpdate(request, i18n)).save()
  }

  async createMessage(content: string, receiverId: number, senderId: number) {
    return await Message.create({
      content,
      receiverId,
      senderId,
    })
  }
}
