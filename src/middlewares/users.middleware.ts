import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { HttpStatus } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { databaseService } from '~/services/database.service'
import usersService from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { Request } from 'express'

export const registerValidation = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USER_MESSAGES.NAME_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.NAME_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USER_MESSAGES.NAME_LENGTH
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExists = await usersService.checkEmailExists(value)
            if (isExists) {
              throw new ErrorWithStatus(USER_MESSAGES.EMAIL_EXISTS, HttpStatus.BAD_REQUEST)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.PASSWORD_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          }
        },
        errorMessage: USER_MESSAGES.PASSWORD_STRONG
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_REQUIRED
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MISMATCH)
            }
            return true
          }
        }
      },
      date_of_birth: {
        notEmpty: {
          errorMessage: USER_MESSAGES.DOB_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: USER_MESSAGES.DOB_IS_ISO8601
        }
      }
    },
    ['body']
  )
)

export const loginValidation = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExist = await usersService.checkEmailExists(value)
            if (!isExist) {
              throw new Error(USER_MESSAGES.USER_NOT_FOUND)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASSWORD_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.PASSWORD_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USER_MESSAGES.PASSWORD_LENGTH
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USER_MESSAGES.PASSWORD_STRONG
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: req.body.email, password: hashPassword(value) })
            if (user === null) {
              throw new Error(USER_MESSAGES.PASSWORD_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage: USER_MESSAGES.ACCESS_TOKEN_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus(USER_MESSAGES.ACCESS_TOKEN_REQUIRED, HttpStatus.UNAUTHORIZED)
            }
            try {
              const decoded_authorization = await verifyToken({ token: access_token })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus(capitalize((error as JsonWebTokenError).message), HttpStatus.UNAUTHORIZED)
            }

            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USER_MESSAGES.REFRESH_TOKEN_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (!refresh_token) {
                throw new ErrorWithStatus(USER_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST, HttpStatus.UNAUTHORIZED)
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus(USER_MESSAGES.REFRESH_TOKEN_INVALID, HttpStatus.UNAUTHORIZED)
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
