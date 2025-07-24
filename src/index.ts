import express from 'express'
import { databaseService } from './services/database.service'
import usersRouter from './routes/users.route'
import { defaultErrorHandler } from './middlewares/errors.middleware'
import { config } from 'dotenv'
config()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

databaseService.connect()

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`TwitterClone app listening on port ${port}`)
})
