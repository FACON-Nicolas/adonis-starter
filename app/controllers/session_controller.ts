import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import loginValidator from '#validators/auth/login'
import registerValidator from '#validators/auth/register'

export default class SessionController {
  async store({ request, response, i18n }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator, {
      messagesProvider: i18n.createMessagesProvider()
    })

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token.value!.release(),
      user,
    })
  }

  async register({ request, response, i18n }: HttpContext) {
    const { email, password, username } = await request.validateUsing(registerValidator, {
      messagesProvider: i18n.createMessagesProvider()
    })
    const user = await User.create({
      email,
      password,
      username,
    })
    const token = await User.accessTokens.create(user, ['server:create', 'server:read'])

    return response.created({
      token: token.value!.release(),
      user: { ...user.serialize() },
    })
  }

  async getProfile({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token.value!.release(),
      user: user,
    })
  }
}
