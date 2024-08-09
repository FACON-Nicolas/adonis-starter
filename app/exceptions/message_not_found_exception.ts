import { Exception } from '@adonisjs/core/exceptions'

export default class MessageNotFoundException extends Exception {
  static status = 404
  identifier = 'errors.E_MESSAGE_NOT_FOUND'
  code = 'E_MESSAGE_NOT_FOUND'
}
