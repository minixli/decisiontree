/**
 * @author Minix Li
 */

var decisiontree = require('./decisionTree');

decisiontree.auto({
  start: function(cb, context) {
    cb.call(null, null, false, {"a": 1});
  },
  decisionA: ['start', true, function(cb, context) {
    console.log(2);
  }],
  decisionB: ['start', false, function(cb, context) {
    console.log(3);
    cb.call(null, null, true, {"b": 2});
  }],
  decisionC: ['decisionB', true, function(cb, context) {
    console.log(context);
    cb.call(null, null, false);
  }]
}, function(err) {
  console.log(err);
});
