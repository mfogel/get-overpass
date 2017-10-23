#!/usr/bin/env node

const getOverpass = require('./')
const pjson = require('./package.json')
const process = require('process')

const argv = require('yargs')
  .usage(
    '$0 <OSM id>',
    pjson['description'],
    (yargs) => {
      yargs.positional('OSM id', {
        describe: 'An OSM compound id (ex: rel/3082668)',
        type: 'string'
      })
    })
  .alias('h', 'help')
  .alias('v', 'version')
  .option('a', {
    alias: 'api-endpoint',
    desc: 'Overpass API endpoint to use',
    default: pjson['default-api-endpoint']
  })
  .strict()
  .argv

async function main () {
  try {
    const data = await getOverpass(argv['OSMid'], argv.apiEndpoint)
    process.stdout.write(JSON.stringify(data))
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

main()
