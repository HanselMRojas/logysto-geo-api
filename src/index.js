const express = require('express')
const router = express.Router()
const JWTMiddleware = require('./middlewares/JwtMiddleware')

const {
  signIn,
  signUp,
  signOut,
  getToken
} = require('./controllers/AuthController')

const { getPosition } = require('./controllers/GeocodeController')

router.post('/geo', [ JWTMiddleware ], getPosition)

router.post('/signin', signIn)
router.post('/signup', signUp)

router.post('/token', [ JWTMiddleware ], getToken)
router.get('/signout', [ JWTMiddleware ], signOut)

module.exports = router
