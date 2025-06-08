import { Request, Response } from 'express'
import usersService from '~/services/users.service'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Login successful',
    data: req.body
  })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersService.register({ email, password })
    res.status(201).json({
      message: 'Register successful',
      result
    })
  } catch (error) {
    console.error('Register failed:', error)
    res.status(400).json({
      error: 'Register failed'
    })
  }
}
