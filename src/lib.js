const Promise = require('bluebird')
const queryOverpass = require('query-overpass')
const defaults = require('../package.json')['option-defaults']

function osmtogeojson2mapbox (osmtogeojsonId) {
  const [osmType, osmTypeId] = osmtogeojsonId.split('/')
  if (osmType === 'relation') return osmTypeId * 10 + 4
  if (osmType === 'way') return osmTypeId * 10 + 1
  if (osmType === 'node') return osmTypeId * 10
  throw new Error(
    `Unable to convert OSMtoGeoJSON ID '${osmtogeojsonId}' to Mapbox ID`
  )
}

function mapbox2osmtogeojson (mapboxId) {
  const osmTypeId = Math.floor(mapboxId / 10)
  const lastDigit = mapboxId % 10
  if (lastDigit === 4) return `relation/${osmTypeId}`
  if (lastDigit === 1) return `way/${osmTypeId}`
  if (lastDigit === 0) return `node/${osmTypeId}`
  throw new Error(
    `Unable to convert Mapbox ID '${mapboxId}' to OSMtoGeoJSON ID`
  )
}

function getQuery (osmtogeojsonId) {
  const [osmType, osmTypeId] = osmtogeojsonId.split('/')
  if (osmType === 'relation') return `relation(${osmTypeId});out geom;`
  if (osmType === 'way') return `way(${osmTypeId});out geom;`
  if (osmType === 'node') return `node(${osmTypeId});out geom;`
  throw new Error(`Unrecognized OSM type ${osmType}`)
}

function getOverpass (
  osmId,
  mapboxIds = defaults['mapbox-ids'],
  apiEndpoint = defaults['api-endpoint']
) {
  if (!String(osmId).includes('/')) osmId = mapbox2osmtogeojson(osmId)

  const opQuery = getQuery(osmId)
  const opOpts = { overpassUrl: apiEndpoint, flatProperties: true }

  return new Promise(function (resolve, reject) {
    function opCallback (error, data) {
      if (error !== undefined) return reject(new Error(error.message))
      if (data.features.length === 0) {
        return reject(new Error(`${osmId} not found`))
      }
      const feature = data.features.find(f => f.id === osmId)
      if (feature === undefined) {
        return reject(
          new Error(
            `Found ${osmId} but did not recieve geometry from ostogeojson.` +
              ` Unable to convert geom to geojson?`
          )
        )
      }
      if (mapboxIds) {
        feature.id = osmtogeojson2mapbox(feature.id)
        feature.properties.id = osmtogeojson2mapbox(feature.properties.id)
      }
      resolve(feature)
    }

    queryOverpass(opQuery, opCallback, opOpts)
  })
}

module.exports = {
  getOverpass: getOverpass,
  getQuery: getQuery,
  mapbox2osmtogeojson: mapbox2osmtogeojson,
  osmtogeojson2mapbox: osmtogeojson2mapbox
}
