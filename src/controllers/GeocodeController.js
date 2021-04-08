const slug = require('slug')
const providers = require('../config/providers')
const GeoCodeFactory = require('../lib/geocode')

exports.getPosition = async (req, res, next) => {
  try {
    const { body } = req
    const geo = new GeoCodeFactory(providers)
    const responses = await geo.run(body.address)

    const payload = geo.providers.reduce((acc, current, index) => {
      const raw = responses[index].data
      return [
        ...acc,
        {
          provider: current.name,
          slig: slug(current.name, { lower: true, replacement: '_' }),
          raw
        }
      ]
    }, [])

    res.status(200).json({
      payload
    })
  } catch (error) {
    console.log(error)
    next({
      original: error,
      status: 500
    })
  }
}
