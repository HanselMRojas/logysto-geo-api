const AccountSchema = require('../schemas/AccountSchema')
const SessionSchema = require('../schemas/SessionSchema')
const Jwt = require('../lib/jwt')

/**
 * GET /v1/signin
 * Este método logea un usuario dado la correcta combinación de nombre de usuario y
 * password.
 *
 * @method GET
 */
exports.signIn = async (req, res, next) => {
  try {
    const { body } = req
    const account = await AccountSchema.findOne({ username: body.username }).select('username password')

    if (account) {
      const comparePassword = Jwt.compareHash(body.password, account.password)
      
      if (comparePassword) {
        const { accessToken, refreshToken } = await Jwt.create(account)

        res.status(200).json({
          accessToken,
          refreshToken
        })
      } else {
        res.status(400).json({
          message: 'La contraseña o nombre de usuario no son válidos'
        })
      }
    } else {
      res.status(404).json({
        message: 'El usuario no fue encontrado'
      })
    }
  } catch (error) {
    next({
      original: error,
      status: 500
    })
  }
}

/**
 * POST /v1/singup
 * Este método da de alta en el sistema un nuevo usuario.
 *
 * @method POST
 */
exports.signUp = async (req, res, next) => {
  try {
    const { body } = req
    const newUser = new AccountSchema({
      ...body,
      _createdAt: new Date()
    })

    await newUser.save()

    const { accessToken, refreshToken } = await Jwt.create(newUser)


    res.status(201).json({
      accessToken,
      refreshToken
    })
  } catch (error) {
    if (error.code === 11000) {
      next({
        status: 400,
        message: 'Este username ya existe, intente nuevamente con un nombre diferente'
      })
    } else {
      next({
        original: error,
        status: 500
      })
    }
  }
}

/**
 * POST /v1/token
 * Este método permite obtener un nuevo accessToken dado un refeshToken correspondiente
 * a la sesión actual del usuario.
 *
 * @method POST
 */
exports.getToken = async (req, res, next) => {
  try {
    const { body, query, session, headers } = req
    const refreshToken = body.refreshToken || query.refreshToken || headers['x-refresh-token'] || null

    const mongoQuery = { _id: session.id, _deleted: false }
    const sess = await SessionSchema.findOne(mongoQuery).select('account hash')

    if (sess) {
      const sessionValid = Jwt.compareHash(refreshToken, sess.hash)
      if (sessionValid) {
        const accessToken = Jwt.createJWT({
          id: session.id,
          uid: sess.account
        }, {
          expiresIn: (60 * 60)
        })

        res.status(200).json({
          accessToken
        })
      } else {
        res.status(401).json({
          message: 'La comprobación de sesión no ha resultado válida'
        })
      }
    } else {
      res.status(404).json({
        message: 'La sesión no ha sido encontrada o ha expirado',
        code: 'SESSION_NOT_FOUND'
      })
    }
  } catch (error) {
    next({
      original: error,
      status: 500
    })
  }
}

/**
 * GET /v1/signOut
 * Este método cierra la sessión de usuario desabilitando el refreshToken
 * correspondiente.
 *
 * @method
 */
exports.signOut = async (req, res, next) => {
  try {
    const { session } = req
    const sess = await SessionSchema.findOne({ _id: session.id })

    if (sess) {
      await SessionSchema.update({ _id: session.id }, { $set: { _deleted: true } })
      res.status(201).json({
        message: 'La sesión se ha cerrado correctamente'
      })
    } else {
      res.status(404).json({
        message: 'La sesión no fue encontrada'
      })
    }
  } catch (error) {
    next({
      original: error,
      status: 500
    })
  }
}
