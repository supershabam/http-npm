# http-npm

An http interface to npm which allows resolving module version and module tarballs.

## `GET /:moduleName/versions.json`

returns 404 if `:moduleName` doesn't exist

returns 200 application/json if found
sets cache headers

```javascript
{
  versions: [
    "0.0.0",
    "0.0.1"
  ]
}
```

## `GET /:moduleName/:version.tgz`

returns 404 if `:moduleName@:version` doesn't exist

returns 200 application/octet-stream if found
sets cache headers

## implementations

An s3 proxy and a couch proxy are provided as implementations.

## license

mit
