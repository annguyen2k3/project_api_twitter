import { Router } from 'express'
import {
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidation,
  refreshTokenValidator,
  registerValidation
} from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

// Description: Login user with email and password
// Path: /users/login
// Method: POST
// Body: { email: string, password: string }
usersRouter.post('/login', loginValidation, wrapRequestHandler(loginController))

// Description: Register a new user
// Path: /users/register
// Method: POST
// Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: string }
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

// Description: Logout user by removing the refresh token
// Path: /users/logout
// Method: POST
// Body: { refresh_token: string }
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

// Description: Verify email when user clicks on the link in the email
// Path: /users/verify-email
// Method: POST
// Body: { email_verify_token: string }
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

// Description: Resend email verification link go to user's email
// Path: /users/resend-verify-email
// Method: POST
// Header: { Authorization: Bearer <access_token> }
// Body: {}
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

export default usersRouter
