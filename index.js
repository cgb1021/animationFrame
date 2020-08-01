"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationStop = exports.animationStart = exports.animationRemove = exports.animationAdd = exports["default"] = void 0;

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  return window.setTimeout(callback, 1000 / 60);
};

var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.clearTimeout;
var animationList = [];
var animationFrameId;

function animationFrame() {
  var time = Date.now();
  animationList.forEach(function (item) {
    if (!item.interval || time - item.time >= item.interval) {
      item.time = time;
      item.fn(time);
    }
  });
  animationFrameId = requestAnimationFrame(animationFrame);
}

var _default = {
  add: animationAdd,
  remove: animationRemove,
  start: animationStart,
  stop: animationStop
};
/*
* 添加动画函数
* @param {Function} fn
* @param {Number} interval
* @param {String} key
* @param {Number} prior
*/

exports["default"] = _default;

var animationAdd = function animationAdd(fn) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var prior = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (typeof fn !== 'function') return;
  var i = 0;

  for (var len = animationList.length; i < len; i++) {
    if (prior > animationList[i].prior) {
      break;
    }
  }

  animationList.splice(i - 1, 0, {
    fn: fn,
    interval: interval,
    time: 0,
    key: key,
    prior: prior
  });
};
/*
* 移除动画函数
* @param {String|Function} key 不传删除所有函数（clean）
*/


exports.animationAdd = animationAdd;

var animationRemove = function animationRemove(key) {
  if (!key) {
    animationList.length = 0;
    return;
  }

  var i = 0;

  for (var len = animationList.length; i < len; i++) {
    var item = animationList[i];

    if (item.key === key || item.fn === key) {
      break;
    }
  }

  animationList.splice(i, 1);
};
/*
 * 开始重复执行requestAnimationFrame
 */


exports.animationRemove = animationRemove;

var animationStart = function animationStart() {
  animationFrameId = requestAnimationFrame(animationFrame);
};
/*
 * 停止执行requestAnimationFrame
 */


exports.animationStart = animationStart;

var animationStop = function animationStop() {
  cancelAnimationFrame(animationFrameId);
};

exports.animationStop = animationStop;