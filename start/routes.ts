/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const SessionController = () => import('#controllers/session_controller')
const MessagesController = () => import('#controllers/messages_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/login', [SessionController, 'login'])
router.post('/register', [SessionController, 'register'])
router
  .group(() => {
    router.get('/me', [SessionController, 'getProfile'])
    router.resource('messages', MessagesController).apiOnly()
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
