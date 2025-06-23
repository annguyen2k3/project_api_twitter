import { HttpStatus } from '~/constants/httpStatus'

type ErrorsType = Record<string, { msg: string; [key: string]: any }>

export class ErrorWithStatus {
  message: string
  status: number

  constructor(message: string, status: number) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  constructor({ message = 'Validation Error', errors }: { message?: string; errors: ErrorsType }) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
    this.errors = errors
  }
}
