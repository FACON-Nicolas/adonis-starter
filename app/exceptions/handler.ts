import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'


export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    //return ctx.response.status(500).json({
    //  error,
    //})
    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response.status(401).json({
        error: "Vous n'êtes pas autorisé à accéder à cette ressource",
      })
    } else if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      return ctx.response.status(401).json({
        error: "Les informations d'identification fournies sont incorrectes",
      })
    }
    return ctx.response.status(error.status).json({
      error: error.messages ? error.messages[0].message : error.message || 'An error occurred',
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
