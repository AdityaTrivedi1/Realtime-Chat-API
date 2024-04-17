const {StatusCodes} = require('http-status-codes')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const {user_id, username, email, password} = req.body
    if (!user_id || !username || !email || !password) {
        res.status(StatusCodes.BAD_REQUEST).send('Please provide user id, user name, email and password')
        return
    }
    if (password.length < 8) {
        res.status(StatusCodes.BAD_REQUEST).send('Password should be atleast 8 characters long')
        return
    }
    if (await User.findOne({user_id})) {
        res.status(StatusCodes.BAD_REQUEST).send('Given user id already exists')
        return
    }
    if (await User.findOne({email})) {
        res.status(StatusCodes.BAD_REQUEST).send('Given email already exists')
        return
    }
    await User.create({user_id, username, email, password})
    const token = jwt.sign({user_id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
    res.status(StatusCodes.CREATED).json({user_id, username, email, token, msg: 'Registered successfully'})
}

const login = async (req, res) => {
    const {user_id, password} = req.body
    if (!user_id || !password) {
        res.status(StatusCodes.BAD_REQUEST).send('Please provide user id and password')
        return
    }
    const user = await User.findOne({user_id})
    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).send('Invalid credentials')
        return
    }
    const isPasswordCorrect = await user.compare(password)
    if (!isPasswordCorrect) {
        res.status(StatusCodes.UNAUTHORIZED).send('Invalid credentials')
        return
    }
    const token = jwt.sign({user_id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
    res.status(StatusCodes.OK).json({token, msg: 'Logged in successfully'})
}

module.exports = {register, login}
