import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'
import usersService from '~/services/users.service'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Login successful',
    data: req.body
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.status(201).json({
    message: 'Register successful',
    result
  })
}
