var Benchmark = require("benchmark");
var _ = require("lodash");

// Source: http://codereview.stackexchange.com/questions/72253/safe-navigating-function-for-nested-object-properties
// Thanks to elclanrs
Object.reduce_attr = function (obj, props) {
  return props.split('.').reduce(function(acc, p) {
    if (acc === null) { return; }
    return acc[p];
  }, obj);
};

// Source: https://gist.github.com/jgornick/3785996
// Thanks to Joe Gornick
Object.walk = function (object, path) {
  if (typeof path == 'string') {
    path = path.split('.');
  }

  for (var i = 0, len = path.length; i < len; i++) {
    if (!object || typeof (object = object[path[i]]) == 'undefined') {
      object = undefined;
      break;
    }
  }

  return object;
};

var suite = new Benchmark.Suite();
var nested_object = { a: {b: {c: 2} } };

suite
  .add('Object.walk found', function() {
    return Object.walk(nested_object, 'a.b.c');
  })
  .add('Object.walk not found', function() {
    return Object.walk(nested_object, 'a.b.nothing');
  })
  .add('Object.reduce_attr found', function() {
    return Object.reduce_attr(nested_object, 'a.b.c');
  })
  .add('Object.reduce_attr not found', function() {
    return Object.reduce_attr(nested_object, 'a.b.nothing');
  })
  .add('Use && found', function() {
    return nested_object && nested_object.a && nested_object.a.b && nested_object.a.b.c;
  })
  .add('Use && not found', function() {
    return nested_object && nested_object.a && nested_object.a.b && nested_object.a.b.nothing;
  })
  .add('Lodash _.get found', function() {
    return _.get(nested_object, 'a.b.c');
  })
  .add('Lodash _.get not found', function() {
    return _.get(nested_object, 'a.b.nothing');
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run({ 'async': true });
