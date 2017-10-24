# get-overpass [![npm version](https://badge.fury.io/js/get-overpass.svg)](https://badge.fury.io/js/get-overpass)
Get OpenStreetMap objects via the Overpass API as GeoJSON

## Quickstart

```sh
$ npm install -g get-overpass
$ get-overpass relation/3082668 > buenos-aires.geojson
```

## CMD

```sh
$ get-overpass [-a/--api-endpoint url] <OSM id>
```

If not otherwise specified, the public Overpass API endpoint `https://overpass-api.de/api/interpreter` is used.

## API

`get-overpass` exports a single function which returns a promise.

```js
function getOverpass(osmId, apiEndpoint = "https://overpass-api.de/api/interpreter") => new Promise()
```

Example:

```js
const getOverpass = require('get-overpass')
getOverpass('relation/3082668')
  .then(data => console.log("Buenos Aires:", data)
  .catch(error => console.log("DOH!", error.message)
```

## OSM ids

There are two valid formats for OSM identifiers:

* `<OSM type>/<OSM id of that type>` This format is used by [osmtogeojson](https://github.com/tyrasd/osmtogeojson).
* `<first letter of OSM type><OSM id of that type>`

Examples of valid and equivalent OSM ids are:

* `r3082668`, `relation/3082668`
* `w213576258`, `way/213576258`
* `n4497495008`, `node/4497495008`

Only `relation`, `way`, and `node` are supported, other non-primary OSM types (ie `area`) are not supported.

## FAQ

### How can I find the OSM id of the feature I want to download?

One way to do this is to use the 'query features' tool (the question mark on the right of the interface) at https://www.openstreetmap.org/.

### Do I need to worry about data licenses?

Maybe. OpenStreetMap data is licensed under the [ODbL](http://www.openstreetmap.org/copyright). Attribution is required, and derivative works must also be licensed under the ODbL.

### Is there a usage limit on the default Overpass API endpoint?

Yes, there is a general 'be friendly' [usage limits](http://wiki.openstreetmap.org/wiki/Overpass_API).

## Credits

Inspired by and makes heavy use of Per Liedman's [query-overpass](https://github.com/perliedman/query-overpass).
