import type { Authenticators } from '@adonisjs/auth/types'
import {SocketMiddleware} from "#services/socket_service";

const SocketAuthMiddleware =
  (options: { guards?: (keyof Authenticators)[] } = {}): SocketMiddleware =>
    async (socket, next) => {
      try {
        await socket.context.auth.authenticateUsing(options.guards)
        next()
      } catch (error) {
        next(new Error(error))
      }
    }

export default SocketAuthMiddleware
