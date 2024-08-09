import loginValidator from "#validators/auth/login";
import {RequestValidator} from "@adonisjs/core/http";
import {I18n} from "@adonisjs/i18n";
import User from "#models/user";
import registerValidator from "#validators/auth/register";

export default class SessionService {
  async validateLogin(request: RequestValidator, i18n: I18n) {
    return await request.validateUsing(loginValidator, {
      messagesProvider: i18n.createMessagesProvider()
    })
  }

  async loginUser(email: string, password: string) {
    return await User.verifyCredentials(email, password)
  }

  async createToken(user: User) {
    const token = await User.accessTokens.create(user)
    return token.value!.release()
  }

  async getAuthResponsePayload(user: User) {
    const token = await this.createToken(user)
    return {
      token,
      user: user.serialize()
    }
  }

  async validateRegister(request: RequestValidator, i18n: I18n) {
    return await request.validateUsing(registerValidator, {
      messagesProvider: i18n.createMessagesProvider()
    })
  }

  async createUser(email: string, password: string, username: string) {
    return await User.create({ email, password, username })
  }
}
