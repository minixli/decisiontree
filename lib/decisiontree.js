/**
 * Decision Tree
 *
 * This decision tree only supports true/false condition now.
 *
 * @author Minix Li
 */

var utils = require('../utils/util');

/**
 * DecisionTree constructor
 *
 * @param {Function} cb
 */
var DecisionTree = function(cb) {
  this.cb = cb;
  this.root = null;
  this.children = {};
};

/**
 * Set root
 *
 * @param {String} name
 * @param {Function} cb
 *
 * @public
 */
DecisionTree.prototype.setRoot = function(name, cb) {
  this.root = this.children[name] = new DecisionNode(cb);
};

/**
 * Add child
 *
 * @param {String} cname
 * @param {String} pname
 * @param {Boolean} cond
 * @param {Function} cb
 *
 * @public
 */
DecisionTree.prototype.addChild = function(cname, pname, cond, cb) {
  var child = new DecisionNode(cb);

  this.children[cname] = child;
  this.children[pname].append(cond, child);
};

/**
 * Start decisions
 *
 * @public
 */
DecisionTree.prototype.startDecisions = function() {
  // feed an empty context
  this.root.decide(this.cb, {});
};

/**
 * DecisionNode constructor
 *
 * @param {Function} cb
 */
var DecisionNode = function(cb) {
  this.cb = cb; // decision callback
  this.leftChild = null;
  this.rightChild = null;
};

/**
 * Append child to this node
 *
 * @param {Boolean} cond
 * @param {TreeNode} child
 *
 * @public
 */
DecisionNode.prototype.append = function(cond, child) {
  cond ? (this.leftChild = child) : (this.rightChild = child);
};

/**
 * Decide and sink into the next decision node
 *
 * @param {Function} cb
 * @param {Object} context
 *
 * @public
 */
DecisionNode.prototype.decide = function(cb, context) {
  var self = this;

  utils.invokeCallback(this.cb, function(err, cond, res) {
    for (var attr in res) {
      context[attr] = res[attr];
    }

    if (err) {
      utils.invokeCallback(cb, err, context);
      return;
    }

    var child;
    cond ? (child = self.leftChild) : (child = self.rightChild);

    if (child) {
      child.decide(cb, context);
    } else {
      utils.invokeCallback(cb, null, context);
    }
  }, context);
};

/**
 * Auto decision
 *
 * @param {Object} decisions
 * @param {Function} cb
 */
var auto = function(decisions, cb) {
  var tree = new DecisionTree(cb);

  for (var name in decisions) {
    var value = decisions[name];

    // set tree root
    if (typeof value == 'function') {
      tree.setRoot(name, value);
    }

    // append child
    if (Array.isArray(value)) {
      var pname = value[0], cond = value[1], cb = value[2];
      tree.addChild(name, pname, cond, cb);
    }
  }

  tree.startDecisions();
};

// export auto method
module.exports = { 'auto': auto };
