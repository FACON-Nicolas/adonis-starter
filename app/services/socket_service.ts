import app from '@adonisjs/core/services/app'
import { Server, ServerOptions } from 'socket.io'
import { HttpContext } from '@adonisjs/core/http'

class Websocket {
  private booted = false

  io!: Server

  async boot() {
    if (this.booted) {
      return
    }

    this.booted = true

    const adonisServer = await app.container.make('server')
    const socketConfig = app.config.get<ServerOptions>('socket')

    this.io = new Server(adonisServer.getNodeServer(), socketConfig)
  }
}

export type SocketMiddleware = Parameters<Websocket['io']['use']>[0]

declare module 'socket.io' {
  interface Socket {
    context: HttpContext
  }
}

export default new Websocket()
