import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { registerValidation } from '~/middlewares/users.middleware'

const usersRouter = Router()

usersRouter.post('/login', loginController)
usersRouter.post('/register', registerValidation, registerController)

export default usersRouter
