/**
 * A simple test for decision tree
 *
 * ***************************************** DECISION TREE *****************************************
 *
 *
 *       start ----- decision A ----- decision C ----- decision D ----- decision E ----- end 6
 *                       |                |                |                |
 *                       |                |                |                |
 *                       |                |                |                |
 *       end 1 ----- decision B         end 3            end 4            end 5
 *                       |
 *                       |
 *                       |
 *                     end 2
 *
 *
 * *************************************************************************************************
 *
 * @author Minix Li
 */

var decisiontree = require('../index');
var util = require('../utils/util');

decisiontree.auto({
  decisionA: function(cb, context) {
    console.log("step into decision A");
    util.invokeCallback(cb, null, false, { a: "a has been set in decision A"});
  },

  decisionB: ['decisionA', true, function(cb, context) {
    console.log("step into decision B");
    util.invokeCallback(cb, null, true, { b: "b has been set in decision B" });
  }],

  end1: ['decisionB', true, function(cb, context) {
    console.log("arrive end 1");
    util.invokeCallback(cb, null);
  }],

  end2: ['decisionB', false, function(cb, context) {
    console.log("arrive end 2");
    util.invokeCallback(cb, null);
  }],

  decisionC: ['decisionA', false, function(cb, context) {
    console.log("step into decision C");
    util.invokeCallback(cb, null, false, { c: "c has been set in decision C" });
  }],

  end3: ['decisionC', true, function(cb, context) {
    console.log("arrive end 3");
    util.invokeCallback(cb, null);
  }],

  decisionD: ['decisionC', false, function(cb, context) {
    console.log("step into decision D");
    util.invokeCallback(cb, null, false, { d: "d has been set in decision D" });
  }],

  end4: ['decisionD', true, function(cb, context) {
    console.log("arrive end 4");
    util.invokeCallback(cb, null);
  }],

  decisionE: ['decisionD', false, function(cb, context) {
    console.log("step into decision E");
    util.invokeCallback(cb, null, false, { e: "e has been set in decision E" });
  }],

  end5: ['decisionE', true, function(cb, context) {
    console.log("arrive end 5");
    util.invokeCallback(cb, null);
  }],

  end6: ['decisionE', false, function(cb, context) {
    console.log("arrive end 6");
    util.invokeCallback(cb, null);
  }]
}, function(err, context) {
  for (var key in context) {
    console.log(context[key]);
  }
});
