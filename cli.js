#!/usr/bin/env node

const getOverpass = require('./')
const pjson = require('./package.json')
const process = require('process')

const argv = require('yargs')
  .usage('$0 <OSM ID>', pjson['description'], yargs => {
    yargs.positional('OSM ID', {
      describe:
        'An OSM ID in either OSMtoGeoJSON or Mapbox form.\n' +
        'OSMtoGeoJSON: {OSM type}/{ID of OSM object of that type}\n' +
        'Mapbox: {OSM node ID}*10 | {OSM way ID}*10+1 | {OSM relation ID}*10+4',
      type: 'string'
    })
  })
  .option('m', {
    alias: 'mapbox-ids',
    desc: 'Output OSM IDs in Mapbox format',
    boolean: true,
    default: pjson['option-defaults']['mapbox-ids']
  })
  .option('a', {
    alias: 'api-endpoint',
    desc: 'Overpass API endpoint to use',
    default: pjson['option-defaults']['api-endpoint']
  })
  .alias('h', 'help')
  .alias('v', 'version')
  .strict().argv

async function main () {
  try {
    const data = await getOverpass(
      argv['OSMID'],
      argv.mapboxIds,
      argv.apiEndpoint
    )
    process.stdout.write(JSON.stringify(data))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
