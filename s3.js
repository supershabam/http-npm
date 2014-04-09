var nopt = require('nopt')
var Q    = require('q')
var _    = require('underscore')

var params = [
  {
    name     : 'bucket',
    type     : String,
    required : true
  },
  {
    name     : 'region',
    type     : String,
    required : true
  },
  {
    name     : 'key',
    type     : String,
    required : true
  },
  {
    name     : 'secret',
    type     : String,
    required : true
  },
  {
    name      : 'port',
    type      : String,
    transform : function(value) {
      return parseInt(value, 10)
    },
    missing   : '8080',
    required  : true
  }
]

function knownOpts() {
  return params.reduce(function(memo, param) {
    memo[param.name] = param.type
    return memo
  }, {})
}

function defaults() {
  return params.reduce(function(memo, param) {
    if (_.has(param, 'missing')) {
      memo[param.name] = param.missing
    }
    return memo
  }, {})
}

function pick(object, keys) {
  return _.pick.apply(_, [object].concat(keys))
}

function argv() {
  return pick(
    _.defaults(
      nopt(knownOpts()), 
      defaults()
    ),
    _.map(params, function(param) {
      return param.name
    })
  )
}

function transform(options) {
  return _.reduce(options, function(memo, value, key) {
    var param = _.find(params, function(param) {
      return param.name == key
    })
    if (param && _.has(param, 'transform')) {
      memo[key] = param.transform(value)
    } else {
      memo[key] = value
    }
    return memo
  }, {})
}

function options() {
  return transform(argv())
}

function doValidate(options) {
  params.forEach(function(param) {
    if (param.required) {
      if (!_.has(options, param.name)) {
        throw new Error('must specify the ' + param.name + ' param')
      }
    }
  })
}

function run() {
  return Q().then(function() {
    var opts = options()
    doValidate(opts)
    
  })
}

run().catch(function(err) {
  console.error(err.message)
  process.exit(1)
})