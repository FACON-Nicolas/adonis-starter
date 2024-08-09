import websocket from '#services/socket_service'
import SocketHttpContextMiddleware from '#middleware/socket/socket_context_http_middleware'
import SocketAuthMiddleware from '#middleware/socket/socket_auth_middleware'
import app from '@adonisjs/core/services/app'

app.ready(async () => {
  await websocket.boot()

  websocket.io.use(SocketHttpContextMiddleware).use(SocketAuthMiddleware({ guards: ['api'] }))
  websocket.io.on('connection', async (socket) => {
    try {
      const user = socket.context.auth.getUserOrFail()
      const rooms = await user.getSocketRooms()
      socket.join(rooms)
      socket.emit('user:connected', { user: user.serialize(), socket: socket.id })
    } catch (error) {
      socket.disconnect()
    }

    socket.on('disconnect', () => {
      socket.disconnect()
    })
  })
})
