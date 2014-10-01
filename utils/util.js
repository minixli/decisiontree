/**
 * utils
 *
 * @author Minix Li
 */

var utils = module.exports;

/**
 * Check and invoke callback
 *
 * @param {Function} cb
 */
utils.invokeCallback = function(cb) {
  if (!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};
