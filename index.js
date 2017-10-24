const Promise = require('bluebird')
const queryOverpass = require('query-overpass')
const pjson = require('./package.json')

function getQuery (compoundId) {
  const osmId = compoundId.match(/(\d+)$/)[0]
  const osmType = compoundId.slice(0, -osmId.length)
  if (['r', 'relation/'].includes(osmType)) return `(relation(${osmId});way(r);node(w););out;`
  if (['w', 'way/'].includes(osmType)) return `((way(${osmId});node(w););out;`
  if (['n', 'node/'].includes(osmType)) return `node(${osmId});out;`
  throw new Error(`Unable to parse ID ${compoundId}`)
}

module.exports = function (compoundId, apiEndpoint = pjson['default-api-endpoint']) {
  const query = getQuery(compoundId)
  const translatedOpts = {overpassUrl: apiEndpoint, flatProperties: true}
  return new Promise(function (resolve, reject) {
    function callback (error, data) {
      if (error !== undefined) reject(new Error(error.message))
      if (data.features.length === 0) reject(new Error(`${compoundId} not found`))
      resolve(data.features[0])
    }
    queryOverpass(query, callback, translatedOpts)
  })
}
