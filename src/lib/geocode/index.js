const axios = require('axios')
const queryString = require('querystring')

class Provider {
  constructor (providerConfig = {}) {
    this.name = providerConfig.name
    this.host = providerConfig.host
    this.queryAuth = providerConfig.queryAuth
    this.queryInput = providerConfig.queryInput
    this.key = providerConfig.key
    this.parseResponse = providerConfig.parseResponse
  }

  /**
   * Geocode Query
   *
   * @param {String} inputText
   * @param {Object} provider
   * @returns Promise<AxiosReponse>
   */
  query (inputText = '') {
    const query = queryString.encode({
      [this.queryInput]: inputText,
      [this.queryAuth]: this.key
    })
  
    return axios({
      url: `${this.host}?${query}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

class ProviderFactory {
  constructor (providers = []) {
    this.providers = providers.map(provider => new Provider(provider))
  }

  run (queryInput = '') {
    return Promise.all(this.providers.map(provider => {
      return provider.query(queryInput)
    }))
  }
}


exports.Provider = Provider
module.exports = ProviderFactory
