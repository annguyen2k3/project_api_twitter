import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidation, registerValidation } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidation, wrapRequestHandler(loginController))
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

export default usersRouter
