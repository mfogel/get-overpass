const Promise = require('bluebird')
const queryOverpass = require('query-overpass')
const defaults = require('./package.json')['option-defaults']

function osmtogeojson2mapbox (osmtogeojsonId) {
  const [osmType, osmTypeId] = osmtogeojsonId.split('/')
  if (osmType === 'relation') return osmTypeId * 10 + 4
  if (osmType === 'way') return osmTypeId * 10 + 1
  if (osmType === 'node') return osmTypeId * 10
  throw new Error(`Unable to convert OSMtoGeoJSON ID '${osmtogeojsonId}' to Mapbox ID`)
}

function mapbox2osmtogeojson (mapboxId) {
  const osmTypeId = Math.floor(mapboxId / 10)
  const lastDigit = mapboxId % 10
  if (lastDigit === 4) return `relation/${osmTypeId}`
  if (lastDigit === 1) return `way/${osmTypeId}`
  if (lastDigit === 0) return `node/${osmTypeId}`
  throw new Error(`Unable to convert Mapbox ID '${mapboxId}' to OSMtoGeoJSON ID`)
}

function getQuery (osmId) {
  if (!String(osmId).includes('/')) osmId = mapbox2osmtogeojson(osmId)
  const [osmType, osmTypeId] = osmId.split('/')
  if (osmType === 'relation') return `(relation(${osmTypeId});way(r);node(w););out;`
  if (osmType === 'way') return `((way(${osmTypeId});node(w););out;`
  if (osmType === 'node') return `node(${osmTypeId});out;`
  throw new Error(`Unrecognized OSM type ${osmType}`)
}

module.exports = function (osmId, mapboxIds = defaults['mapbox-ids'], apiEndpoint = defaults['api-endpoint']) {
  const query = getQuery(osmId)
  const translatedOpts = {overpassUrl: apiEndpoint, flatProperties: true}
  return new Promise(function (resolve, reject) {
    function callback (error, data) {
      if (error !== undefined) reject(new Error(error.message))
      if (data.features.length === 0) reject(new Error(`${osmId} not found`))
      const feature = data.features[0]
      if (mapboxIds) {
        feature.id = osmtogeojson2mapbox(feature.id)
        feature.properties.id = osmtogeojson2mapbox(feature.properties.id)
      }
      resolve(feature)
    }
    queryOverpass(query, callback, translatedOpts)
  })
}
