"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationAdd = animationAdd;
exports.animationRemove = animationRemove;
exports.animationStart = animationStart;
exports.animationStop = animationStop;
exports["default"] = void 0;

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  return window.setTimeout(callback, 1000 / 60);
};

var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.clearTimeout;
var animationList = [];
var animationFrameId;
var status = false;

function animationFrame() {
  var time = Date.now();
  animationList.forEach(function (item) {
    if (status && (!item.interval || time - item.time >= item.interval)) {
      item.time = time;
      item.fn(time);
    }
  });
  if (status) animationFrameId = requestAnimationFrame(animationFrame);
}
/*
* 添加动画函数
* @param {Function} fn
* @param {Number} interval
* @param {String} key
* @param {Number} prior
*/


function animationAdd(fn) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var prior = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (typeof fn !== 'function') {
    console.warn('no function');
    return;
  }

  var index = -1;

  for (var _i = 0, len = animationList.length; _i < len; _i++) {
    if (animationList[_i].fn === fn) {
      index = -1;
      break;
    }

    if (index === -1 && prior > animationList[_i].prior) {
      index = _i;
    }
  }

  if (index > -1) {
    animationList.splice(i, 0, {
      fn: fn,
      interval: interval,
      time: 0,
      key: key,
      prior: prior
    });
  }

  return index;
}
/*
* 移除动画函数
* @param {String|Function} key 不传删除所有函数（clean）
*/


function animationRemove(key) {
  var res = 0;

  if (!key) {
    res = animationList.length;
    animationList.length = 0;
    return res;
  }

  var i = 0;
  var itemKey = typeof key === 'function' ? 'fn' : 'key';

  while (i < animationList.length) {
    var item = animationList[i];

    if (item[itemKey] === key) {
      animationList.splice(i, 1);
      res++;
      continue;
    }

    i++;
  }

  return res;
}
/*
 * 开始重复执行requestAnimationFrame
 */


function animationStart() {
  status = true;
  animationFrameId = requestAnimationFrame(animationFrame);
}
/*
 * 停止执行requestAnimationFrame
 */


function animationStop() {
  status = false;
  cancelAnimationFrame(animationFrameId);
}
/*
 * 执行requestAnimationFrame对象{start, stop, remove, fn}
 * @param {Function} fn
 * @param {Number} interval 执行间隔
 */


function animation(fn) {
  var _this = this;

  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  this.status = 0;
  this.fn = null;
  this.interval = Math.max(0, +interval);
  var frameId = 0;
  var frameItem = {
    fn: typeof fn === 'function' ? fn : null
  };

  var _frame1 = function _frame1() {
    frameId = requestAnimationFrame(function () {
      frameItem.fn(Date.now());
      if (_this.status) _frame1();
    });
  };

  var _frame2 = function _frame2() {
    frameId = requestAnimationFrame(function () {
      var now = Date.now();

      if (now - frameItem.time >= _this.interval) {
        frameItem.time = now;
        frameItem.fn(now);
      }

      if (_this.status) _frame2();
    });
  };

  this.start = function () {
    if (typeof frameItem.fn !== 'function') {
      console.warn('no function');
      return;
    }

    this.status = 1;

    if (this.interval) {
      frameItem.time = 0;

      _frame2();
    } else {
      _frame1();
    }
  };

  this.stop = function () {
    this.status = 0;
    cancelAnimationFrame(frameId);
  };

  this.remove = function () {
    this.stop();
    frameItem.fn = null;
  };

  this.fn = function (fn) {
    if (typeof fn === 'function') {
      frameItem.fn = fn;
    }
  };
}

var _default = animation;
exports["default"] = _default;