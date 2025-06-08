import User from '~/models/schemas/User.schema'
import { databaseService } from './database.service'

class UserService {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return result
  }

  async checkEmailExists(email: string) {
    const isExistsEmail = await databaseService.users.findOne({ email })
    return Boolean(isExistsEmail)
  }
}

const usersService = new UserService()
export default usersService
