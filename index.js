const Promise = require('bluebird')
const queryOverpass = require('query-overpass')
const pjson = require('./package.json')

function getQuery (compoundId) {
  const [osmType, id] = compoundId.split('/')
  if ('relation'.startsWith(osmType)) return `(relation(${id});way(r);node(w););out;`
  if ('way'.startsWith(osmType)) return `((way(${id});node(w););out;`
  if ('node'.startsWith(osmType)) return `node(${id});out;`
  throw new Error(`Unrecognized osm type ${osmType}`)
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
