import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { registerValidation } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginController)
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

export default usersRouter
