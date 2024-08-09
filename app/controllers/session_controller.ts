import { HttpContext } from '@adonisjs/core/http'
import {inject} from "@adonisjs/core";
import SessionService from "#services/session_service";

@inject()
export default class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async login({ request, response, i18n }: HttpContext) {
    const { email, password } = await this.sessionService.validateLogin(request, i18n)
    const user = await this.sessionService.loginUser(email, password)
    const authPayload = await this.sessionService.getAuthResponsePayload(user)

    return response.ok(authPayload)
  }

  async register({ request, response, i18n }: HttpContext) {
    const { email, password, username } = await this.sessionService.validateRegister(request, i18n)
    const user = await this.sessionService.createUser(email, password, username)
    const authPayload = await this.sessionService.getAuthResponsePayload(user)

    return response.created(authPayload)
  }

  async getProfile({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const authPayload = await this.sessionService.getAuthResponsePayload(user)

    return response.ok(authPayload)
  }
}
