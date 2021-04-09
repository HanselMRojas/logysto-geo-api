const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const SessionSchema = require('../../schemas/SessionSchema')

class JwtService {
  async create (account){
    let sessions = await SessionSchema.count({ account: account._id })
    
    if (sessions > 0) {
      await SessionSchema.updateMany({
        account: account._id
      }, {
        $set: { _deleted: true }
      })
    }

    const hash = this.createRefreshToken()
    
    const newSession = new SessionSchema({
      account: account,
      hash,
      _createdAt: new Date()
    })

    const accessToken = this.createJWT({
      id: newSession._id,
      uid: account._id
    }, {
      expiresIn: (60 * 60)
    })

    await newSession.save()

    return {
      session: newSession,
      accessToken,
      refreshToken: hash
    }
  }

  createRefreshToken (len = 128) {
    return crypto.randomBytes(len).toString('hex')
  }

  createJWT (payload = {}, config = {}) {
    return jwt.sign(payload, process.env.SESSION_KEY, config)
  }

  verifyJWT (token) {
    return jwt.verify(token, process.env.SESSION_KEY)
  }

  compareHash (input, currentHash) {
    return bcrypt.compareSync(input, currentHash)
  }
}

module.exports = new JwtService()
