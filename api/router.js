import Router from '@koa/router'

import * as users from './users/index.js'
import * as hunches from './hunches/index.js'
import * as games from './games/index.js'

export const router = new Router()

router.get('/users', users.list)
router.post('/users', users.create)
router.get('/login', users.login)

router.get('/hunches', hunches.listAll)
router.get('/hunches/:username', hunches.list)
router.post('/hunches', hunches.create)

router.get('/games', games.list)
router.post('/games', games.create)
