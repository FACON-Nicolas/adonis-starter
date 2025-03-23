import loginValidator from '#validators/auth/login'
import { RequestValidator } from '@adonisjs/core/http'
import { I18n } from '@adonisjs/i18n'
import User from '#models/user'
import registerValidator from '#validators/auth/register'
import { ModelObject } from '@adonisjs/lucid/types/model'

interface Token {
  token: string
  expiresAt: Date | null
}

interface AuthResponse extends Token {
  user: ModelObject
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  email: string
  password: string
  username: string
}

export default class SessionService {
  async validateLogin(request: RequestValidator, i18n: I18n): Promise<LoginCredentials> {
    return await request.validateUsing(loginValidator, {
      messagesProvider: i18n.createMessagesProvider(),
    })
  }

  async loginUser(email: string, password: string): Promise<User> {
    return await User.verifyCredentials(email, password)
  }

  async createToken(user: User): Promise<Token> {
    const token = await User.accessTokens.create(user)
    return {
      token: token.value!.release(),
      expiresAt: token.expiresAt,
    }
  }

  async getAuthResponsePayload(user: User): Promise<AuthResponse> {
    const token = await this.createToken(user)
    return {
      token: token.token,
      expiresAt: token.expiresAt,
      user: user.serialize(),
    }
  }

  async validateRegister(request: RequestValidator, i18n: I18n): Promise<RegisterCredentials> {
    return await request.validateUsing(registerValidator, {
      messagesProvider: i18n.createMessagesProvider(),
    })
  }

  async createUser(email: string, password: string, username: string): Promise<User> {
    return await User.create({ email, password, username })
  }
}
