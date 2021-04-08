module.exports = [
  /**
   * Google Maps
   * @see https://developers.google.com/maps/documentation/geocoding/overview
   */
  {
    name: 'Google Maps',
    host: 'https://maps.googleapis.com/maps/api/geocode/json',
    queryInput: 'address',
    queryAuth: 'key',
    key: process.env.MAPS_GOOGLE_API_KEY
  },
  /**
   * Here Maps
   * @see https://developer.here.com/documentation/geocoder/dev_guide/topics/quick-start-geocode.html
   */
  {
    name: 'Here Maps',
    host: 'https://geocoder.ls.hereapi.com/6.2/geocode.json',
    queryInput: 'searchtext',
    queryAuth: 'apiKey',
    key: process.env.MAPS_HERE_API_KEY
  }
]
