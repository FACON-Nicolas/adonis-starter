import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import loginValidator from '#validators/auth/login'
import registerValidator from '#validators/auth/register'

export default class SessionController {
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    let user = await User.verifyCredentials(email, password)
    user = await User.query()
      .preload('shoppingItems')
      .preload('shoppingLists')
      .where('id', user.id)
      .firstOrFail()
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token.value!.release(),
      user,
    })
  }

  async register({ request, response }: HttpContext) {
    const { email, password, username } = await request.validateUsing(registerValidator)
    const user = await User.create({
      email,
      password,
      username,
    })
    const token = await User.accessTokens.create(user, ['server:create', 'server:read'])
    const userWithoutPassword = { ...user.serialize(), password: undefined }

    return response.ok({
      token: token.value!.release(),
      user: {
        ...userWithoutPassword,
        shoppingItems: [],
        shoppingLists: [],
      },
    })
  }

  async getProfile({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const token = await User.accessTokens.create(user)
    const userWithRelations = await User.query()
      .preload('shoppingItems')
      .preload('shoppingLists')
      .where('id', user.id)
      .firstOrFail()

    return response.ok({
      token: token.value!.release(),
      user: { ...userWithRelations.serialize() },
    })
  }
}
