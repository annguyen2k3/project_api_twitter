import { RequestHandler, Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unFollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import { filterMiddleware } from '~/middlewares/common.middleware'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidation,
  loginValidation,
  refreshTokenValidator,
  registerValidation,
  resetPasswordValidation,
  unFollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordValidation
} from '~/middlewares/users.middleware'
import { UpdateMeReqBody } from '~/models/requests/User.request'
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

// Description: Submit email to reset password, send email to user's email with reset password link
// Path: /users/forgot-password
// Method: POST
// Body: { email: string }
usersRouter.post('/forgot-password', forgotPasswordValidation, wrapRequestHandler(forgotPasswordController))

// Description: Verify link in the email to reset password
// Path: /users/verify-forgot-password
// Method: POST
// Body: { forgot_password_token: string }
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidation,
  wrapRequestHandler(verifyForgotPasswordController)
)

// Description: Reset password after verifying the forgot password token
// Path: /users/reset-password
// Method: POST
// Body: { forgot_password_token: string, password: string, confirm_password: string }
usersRouter.post('/reset-password', resetPasswordValidation, wrapRequestHandler(resetPasswordController))

// Description: Get current user's profile information
// Path: /users/me
// Method: GET
// Header: { Authorization: Bearer <access_token> }
// Body: { }
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(meController))

// Description: Update my profile information
// Path: /users/me
// Method: PATCH
// Header: { Authorization: Bearer <access_token> }
// Body: UserSchema
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

// Description: Follow someone
// Path: /users/follow
// Method: POST
// Header: { Authorization: Bearer <access_token> }
// Body: { followed_user_id: string }
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

// Description: Unfollow someone
// Path: /users/follow/:user_id
// Method: DELETE
// Header: { Authorization: Bearer <access_token> }
// Body: { }
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController as RequestHandler)
)

// Description: Change password
// Path: /users/change-password
// Method: PUT
// Header: { Authorization: Bearer <access_token> }
// Body: { old_password: string, password: string, confirm_password: string }
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
