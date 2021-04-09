const Jwt = require('../lib/jwt')

module.exports = async (req, res, next) => {
  try {
    const header= req.headers['authorization']
    /* Check if Authorization Header is sended in the request */
    if (!header) {
      next({
        status: 400,
        message: 'El header de autenticacion no viene incluido'
      })
    }

    let sign

    if (header.startsWith('Bearer') || header.startsWith('Barear')) {
      sign = header.split(' ')[1]
    } else {
      sign = header
    }

    const token = Jwt.verifyJWT(sign)
    req.session = token
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next({
        status: 400,
        message: 'Token inválido. Parece que no pudimos validar la integridad del token. Vuelve a solicitar uno nuevo'
      })
    } else if (err.name === 'TokenExpiredError') {
      next({
        status: 401,
        message: 'Token de sesión ha expirado. Vuelva a solicitar uno nuevo!'
      })
    } else {
      next({
        original: err,
        status: 500
      })
    }
  }
}
