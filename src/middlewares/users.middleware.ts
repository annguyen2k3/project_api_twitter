import { checkSchema } from 'express-validator'
import { HttpStatus } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import usersService from '~/services/users.service'
import { validate } from '~/utils/validation'

export const registerValidation = validate(
  checkSchema({
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
  })
)
