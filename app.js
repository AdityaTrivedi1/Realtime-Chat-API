require('dotenv').config()
require('express-async-errors')

// db
const connectDB = require('./db/connectDB')

// notFound
const notFound = require('./middleware/notFound')

// customErrorHandler
const customErrorHandler = require('./middleware/customErrorHandler')

// security packages
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

// authRoute
const authRoute = require('./routes/authRoutes')

const express = require('express')
const app = express()


app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMS: 60 * 1000,
    max: 60
}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())

app.get('/api/v1', (req, res) => {
    res.send('Web Chat App Backend')
})

app.use('/api/v1/auth', authRoute)

app.use(notFound)
app.use(customErrorHandler)


const port = process.env.PORT || 3000

const start = async () => {
    try {
        connectDB(process.env.MONGO_URI)
        app.listen(port)
        console.log(port, `Server is listening on port ${port}...`)
    } catch (error) {
        console.log('Unable to start server')
        console.log(error)
    }
}

start()
