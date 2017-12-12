/* eslint-env jest */

const lib = require('../src/lib.js')

function testBackAndForthIdConversion (osmtogeoid, mapboxid) {
  expect(lib.osmtogeojson2mapbox(osmtogeoid)).toBe(mapboxid)
  expect(lib.mapbox2osmtogeojson(mapboxid)).toBe(osmtogeoid)
  expect(lib.mapbox2osmtogeojson(String(mapboxid))).toBe(osmtogeoid)
}

test('covert node id to & from mapbox & osmtogeojson ids', () => {
  testBackAndForthIdConversion('node/4497495008', 44974950080)
})

test('covert way id to & from mapbox & osmtogeojson ids', () => {
  testBackAndForthIdConversion('way/213576258', 2135762581)
})

test('covert relation id to & from mapbox & osmtogeojson ids', () => {
  testBackAndForthIdConversion('relation/3082668', 30826684)
})

/* TODO: Network calls on these tests should be stubbed out.
 *       Not just for performance. OSM data can change at anytime. */

function getAndCompareGeojson (id, jsonFn) {
  const geojson = require(`./${jsonFn}`)
  expect.assertions(1)
  return expect(lib.getOverpass(id)).resolves.toEqual(geojson)
}

test('query relation multi-polygon', () => {
  return getAndCompareGeojson('relation/3947664', 'farallon-refuge.json')
})

test('query relation polygon', () => {
  return getAndCompareGeojson(23641634, 'dique-3.json')
})

test('query closed way', () => {
  return getAndCompareGeojson('99392311', 'parque-centenario.json')
})

test('query open way', () => {
  return getAndCompareGeojson(5337037291, 'una-bicisenda.json')
})

test('query node', () => {
  return getAndCompareGeojson('node/4497495008', 'obelisco.json')
})
