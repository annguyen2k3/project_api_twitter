import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import { HttpStatus } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import {
  EmailVerifyReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload
} from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import { databaseService } from '~/services/database.service'
import usersService from '~/services/users.service'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())

  res.status(HttpStatus.OK).json({
    message: 'Login successful',
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.status(HttpStatus.CREATED).json({
    message: 'Register successful',
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  res.json({ result })
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, EmailVerifyReqBody>, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(HttpStatus.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
    return
  }

  if (user.email_verify_token === '') {
    res.status(HttpStatus.OK).json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
    return
  }

  const result = await usersService.verifyEmail(user_id)
  res.status(HttpStatus.OK).json({
    message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(HttpStatus.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
    return
  }
  if (user.verify === UserVerifyStatus.Verified) {
    res.status(HttpStatus.OK).json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
    return
  }
  const result = await usersService.resendVerifyEmail(user_id)
  res.json(result)
}
