# get-overpass [![npm version](https://badge.fury.io/js/get-overpass.svg)](https://badge.fury.io/js/get-overpass)
Get OpenStreetMap objects via the Overpass API as GeoJSON

## Quickstart

```sh
$ npm install -g get-overpass
$ get-overpass relation/3082668 > buenos-aires.geojson
```

## CMD

```sh
$ get-overpass [-a/--api-endpoint url] [-m/--mapbox-ids] <OSM ID>
```


## API

`get-overpass` exports a single function which returns a promise.

```js
function getOverpass(osmId, mapboxIds = false, apiEndpoint = "https://overpass-api.de/api/interpreter") => new Promise()
```

Example:

```js
const getOverpass = require('get-overpass')
getOverpass('relation/3082668')
  .then(data => console.log("Buenos Aires:", data)
  .catch(error => console.log("DOH!", error.message)
```

## OSM IDs

There are two valid formats for OSM identifiers:

* The [OSMtoGeoJSON string format](https://github.com/tyrasd/osmtogeojson): `{OSM type}/{OSM ID of that type}`
* The [Mapbox globally unique numeric format](https://www.mapbox.com/vector-tiles/mapbox-streets-v7/):
    * nodes: `{OSM node ID} * 10`
    * ways: `{OSM way ID} * 10 + 1`
    * relations: `{OSM relation ID} * 10 + 4`

Examples of valid and equivalent OSM IDs are (osmtogeojson format, mapbox format):

* `relation/3082668`, `30826684`
* `way/213576258`, `2135762581`
* `node/4497495008`, `44974950080`

Only the primary OSM types `relation`, `way`, and `node` are supported, other types (ie `area`) are not supported.

## Options

### `-a`/`--api-endpoint`/`apiEndpoint`

Use the given url as an Overpass API endpoint. If not set, the default public Overpass API instance `https://overpass-api.de/api/interpreter` will be used. Note that general 'be friendly' [data usage limits](http://wiki.openstreetmap.org/wiki/Overpass_API) apply to the default endpoint.

### `-m`/`--mapbox-ids`/`mapboxIds`

Format IDs in the output in Mapbox format. If not set, ID's will be in the default OSMtoGeoJSON format.

## FAQ

### How can I find the OSM ID of the feature I want to download?

One way to do this is to use the 'query features' tool (the question mark on the right of the interface) at https://www.openstreetmap.org/.

### Do I need to worry about data licenses?

Maybe. OpenStreetMap data is licensed under the [ODbL](http://www.openstreetmap.org/copyright). Attribution is required, and derivative works must also be licensed under the ODbL.

## Credits

Inspired by and makes heavy use of Per Liedman's [query-overpass](https://github.com/perliedman/query-overpass).
