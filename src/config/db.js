const mongoose = require('mongoose')
const chalk = require('chalk')

class MongoDBConnect {
  constructor (props) {
    this.default = {
      host: 'localhost',
      db: 'test',
      port: '27017',
      auth: false
    }
  }

  connect (conf = {}) {
    const credentials = Object.assign({}, this.default, conf)

    mongoose.Promise = global.Promise

    mongoose.connection.on('connected', () => {
      setTimeout(() => {
        console.log(chalk.green('MONGO [ OK ]\n'))
      }, 400)
    })

    mongoose.connection.on('error', () => {
      process.stdout.write(chalk.red('ERROR MONGO CONNECT DB'))
      console.log('#MONGO_ERROR: CONNECT TO DB')
    })

    if (credentials.auth) {
      mongoose.connect(`mongodb+srv://${credentials.username}:${credentials.password}@${credentials.host}/${credentials.db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    } else {
      mongoose.connect(`mongodb+srv://${credentials.host}:${credentials.port}/${credentials.db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }

    return mongoose
  }
}

module.exports = new MongoDBConnect
