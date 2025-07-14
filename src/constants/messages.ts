export const COMMON_MESSAGES = {
  VALIDATION_ERROR: 'Validation error'
} as const

export const USER_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  NAME_REQUIRED: 'Name is required',
  NAME_STRING: 'Name must be a string',
  NAME_LENGTH: 'Name must be between 1 and 100 characters',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Invalid email format',
  EMAIL_EXISTS: 'Email already exists',
  PASSWORD_INCORRECT: 'Incorrect password',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_STRING: 'Password must be a string',
  PASSWORD_LENGTH: 'Password must be between 6 and 50 characters',
  PASSWORD_STRONG:
    'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MISMATCH: 'Passwords confirmation does not match password',
  DOB_REQUIRED: 'Date of birth is required',
  DOB_IS_ISO8601: 'Date of birth must be a valid ISO 8601 date',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email is already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verified successfully',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successfully',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exists',
  LOGOUT_SUCCESS: 'Logout successful',
  CHECK_EMAIL_TO_FORGOT_PASSWORD: 'Please check your email to reset your password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password successfully',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully'
} as const
