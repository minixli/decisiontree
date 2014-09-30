/**
 * Decision tree
 *
 * This decision tree only supports true/false condition now.
 *
 * @author Minix Li
 */

var utils = require('./utils');

/**
 * Tree constructor
 *
 * @param {Function} callback
 */
var Tree = function(callback) {
  this.cb = callback;
  this.root = null;
  this.children = {};
};

/**
 * Set root node
 *
 * @param {String} cname
 * @param {Function} cb
 *
 * @public
 */
Tree.prototype.setRoot = function(cname, cb) {
  this.root = this.children[cname] = new TreeNode(cb);
};

/**
 * Add child node
 *
 * @param {String} cname
 * @param {String} pname
 * @param {Boolean} cond
 * @param {Function} cb
 *
 * @public
 */
Tree.prototype.addChild = function(cname, pname, cond, cb) {
  // decision tree only supports true/false condition
  if (typeof cond !== 'boolean') {
    return;
  }

  var node = new TreeNode(cb);
  this.children[cname] = node;

  if (this.children[pname]) {
    this.children[pname].appendChild(cond, node);
  }
};

/**
 * Start decisions
 *
 * @public
 */
Tree.prototype.startDecisions = function() {
  if (this.root) {
    this.root.startDecision(this.cb, {});
  }
};

/**
 * TreeNode constructor
 *
 * @param {Function} callback
 */
var TreeNode = function(callback) {
  // decision callback
  this.cb = callback;

  // child nodes
  this.leftChild = null;
  this.rightChild = null;
};

/**
 * Append child to this node
 *
 * @param {Boolean} cond
 * @param {TreeNode} node
 *
 * @public
 */
TreeNode.prototype.appendChild = function(cond, node) {
  cond ? (this.leftChild = node) : (this.rightChild = node);
};

/**
 * Start decision
 *
 * @param {Function} callback
 * @param {Object} context
 *
 * @public
 */
TreeNode.prototype.startDecision = function(callback, context) {
  var self = this;

  utils.invokeCallback(this.cb, function(err, cond, res) {
    if (err) {
      utils.invokeCallback(callback, err);
      return;
    }
    if (typeof cond !== 'boolean') {
      return;
    }

    var node;
    cond ? (node = self.leftChild) : (node = self.rightChild);

    if (node) {
      for (var attr in res) {
        context[attr] = res[attr];
      }

      node.startDecision(callback, context);
    } else {
      utils.invokeCallback(callback, null);
    }
  }, context);
};

/**
 * Decision tree auto
 *
 * @param {Object} decisions
 * @param {Function} cb
 */
var auto = function(decisions, cb) {
  var tree = new Tree(cb);

  for (var key in decisions) {
    var value = decisions[key];

    // set tree root
    if (typeof value == 'function') {
      var cname = key;
      var cb = value;

      tree.setRoot(cname, cb);
    }

    // append child
    if (Array.isArray(value) && value.length == 3) {
      if (typeof value[0] !== 'string') {
        continue;
      }
      if (typeof value[1] !== 'boolean') {
        continue;
      }
      if (typeof value[2] !== 'function') {
        continue;
      }

      var cname = key;
      var pname = value[0], cond = value[1], cb = value[2];

      tree.addChild(cname, pname, cond, cb);
    }
  }

  tree.startDecisions();
};

// export auto method
module.exports = { 'auto': auto };
