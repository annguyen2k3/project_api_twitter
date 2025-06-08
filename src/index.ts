import express from 'express'
import { databaseService } from './services/database.service'
import usersRouter from './routes/users.route'
const app = express()
const port = 3000

app.use(express.json())

databaseService.connect()

app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
