import MessageService from '#services/message_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class MessagesController {
  constructor(private readonly messageService: MessageService) {}
  /**
   * Display a list of resource
   */
  async index({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const messages = await this.messageService.findAllMessagesFromUserSerialized(user)
    return response.ok(messages)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, i18n, response }: HttpContext) {
    const { content, receiverId, senderId } = await this.messageService.validateMessageCreation(
      request,
      i18n
    )

    const message = await this.messageService.createMessage(content, receiverId, senderId)
    return response.created(message.serialize())
  }

  /**
   * Show individual record
   */
  async show({ params, response, bouncer }: HttpContext) {
    const message = await this.messageService.findMessageByIdOrFail(params.id)
    await bouncer.with('MessagePolicy').authorize('show', message)
    return response.ok(message.serialize())
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, i18n, response, bouncer }: HttpContext) {
    const message = await this.messageService.findMessageByIdOrFail(params.id)
    await bouncer.with('MessagePolicy').authorize('update', message)

    const newMessage = await this.messageService.updateMessage(message, request, i18n)
    return response.ok(newMessage.serialize())
  }

  /**
   * Delete record
   */
  async destroy({ params, response, bouncer }: HttpContext) {
    const message = await this.messageService.findMessageByIdOrFail(params.id)
    await bouncer.with('MessagePolicy').authorize('delete', message)

    await message.delete()
    return response.noContent()
  }
}
