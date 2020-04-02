import Benchmark from "benchmark";
import _ from "lodash";

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
  .add('Object.walk found', () => {
    return Object.walk(nested_object, 'a.b.c');
  })
  .add('Object.walk not found', () => {
    return Object.walk(nested_object, 'a.b.nothing');
  })
  .add('Object.reduce_attr found', () => {
    return Object.reduce_attr(nested_object, 'a.b.c');
  })
  .add('Object.reduce_attr not found', () => {
    return Object.reduce_attr(nested_object, 'a.b.nothing');
  })
  .add('Use && found', () => {
    return nested_object && nested_object.a && nested_object.a.b && nested_object.a.b.c;
  })
  .add('Use && not found', () => {
    return nested_object && nested_object.a && nested_object.a.b && nested_object.a.b.nothing;
  })
  .add('Lodash _.get found', () => {
    return _.get(nested_object, 'a.b.c');
  })
  .add('Lodash _.get not found', () => {
    return _.get(nested_object, 'a.b.nothing');
  })
  .add('Optional chain proposal ES proposal, found', () => { // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
    return nested_object?.a?.b?.c;
  })
  .add('Optional chain proposal ES proposal, not found', () => {
    return nested_object?.a?.b?.nothing;
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run({ 'async': true });
