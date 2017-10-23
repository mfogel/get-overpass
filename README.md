# get-overpass
Get OpenStreetMap objects via the Overpass API as GeoJSON

## NOTE: This is a work in progress. Documentation below describes features in development. This message will be removed once MVP is done, and the project will be pushed to npm.

## Quickstart

```sh
$ npm install -g get-overpass
$ get-overpass relation/3082668 > buenos-aires.geojson
```

## CMD

Object ids may be passed to `get-overpass` in two ways:

* as one or more positional arguments
* as a space-separated series of strings via stdin

If any ids are passed as arguments, stdin will be ignored. The following are equivalent:

```sh
$ get-overpass relation/3082668 > buenos-aires.geojson
$ echo relation/3082668 | get-overpass > buenos-aires.geojson
```

The generated GeoJSON will be either a Feature or a FeatureCollection, depending on how many ids were passed in.

```sh
$ get-overpass way/213576260 > a-path-in-playa-de-mayo.geojson                  # Feature
$ get-overpass way/213576258 way/213576260 > footpaths-in-playa-de-mayo.geojson # FeatureCollection
```

Object identifiers can be formatted in a few ways:

* relations: `r/3082668`, `rel/3082668`, `relation/3082668`
* ways: `w/213576258`, `way/213576258`
* nodes: `n/4497495008`, `node/4497495008`

Equivalent:

```sh
$ get-overpass node/4497495008 > obelisco.geojson
$ get-overpass n/4497495008 > obelisco.geojson
```

By default, the Overpass API endpoint `http://overpass-api.de/api/interpreter` will be used. Note that 'be friendly' [usage limits](http://wiki.openstreetmap.org/wiki/Overpass_API) apply. To use a different Overpass API endpoint, use the `-e`/`--api-endpoint` option.

```sh
$ get-overpass -e https://my-overpass.com/api/interpreter relation/60189 > russia-is-big.geojson
```

## API

`get-overpass` exports a class with four methods and one property:

### `getOverpass.get(<id::str>, ...)`

```js
const go = require('get-overpass')
const buenosAiresAndObelisco = go.get('rel/3082668', 'node/4497495008')
```

### `getOverpass.getRelation(<relationID::number|str>, ...)`

```js
const go = require('get-overpass')
const buenosAires = go.getRelation(3082668)
```

### `getOverpass.getWay(<wayID::number|str>, ...)`

```js
const go = require('get-overpass')
const buenosAires = go.getWay(213576258, '213576260')
```

### `getOverpass.getNode(<nodeID::number|str>, ...)`

```js
const go = require('get-overpass')
const obelisco = go.get(4497495008)
```

### `getOverpass.apiEndpoint`

```js
const go = require('get-overpass')
console.log(go.apiEndpoint) // https://overpass-api.de/api/interpreter
go.apiEndpoint = 'https://antoher-overpass-api-instance.com/api/interpreter'
```

## FAQ

### How can I find the OSM id of the feature I want to download?

One way to do this is to use the 'query features' tool (the question mark on the right of the interface) at https://www.openstreetmap.org/.

### Do I need to worry about data licenses?

Maybe. OpenStreetMap data is licensed under the [ODbL](http://www.openstreetmap.org/copyright). Attribution is required, and derivative works must also be licensed under the ODbL.

## Contributing

Found a bug? Got a feature request? Please file a github issue or, better yet, make a pull request.

## Credits

Inspired by and makes heavy use of Per Liedman's [query-overpass](https://github.com/perliedman/query-overpass).
