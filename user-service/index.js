import express from 'express'
import cors from 'cors'
import { login, adminFunc, allFunc, logout } from './controller/user-controller.js';

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

const router = express.Router()

// Controller will contain all the User-defined Routes
router.post('/login', login)
router.post('/logout', logout)
router.get('/admin', adminFunc)
router.get('/all', allFunc)

app.use('/api', router).all((_, res) => {
  res.setHeader('content-type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8000, () => console.log('service listening on port 8000'));