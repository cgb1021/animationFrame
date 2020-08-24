"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationAdd = animationAdd;
exports.animationRemove = animationRemove;
exports.animationStart = animationStart;
exports.animationStop = animationStop;
exports["default"] = void 0;

var requestAnimationFrame = function requestAnimationFrame(callback) {
  return setTimeout(callback, 1000 / 60);
};

var cancelAnimationFrame = clearTimeout;

if (typeof window !== 'undefined') {
  if (typeof window.requestAnimationFrame !== 'undefined') {
    requestAnimationFrame = window.requestAnimationFrame;
    cancelAnimationFrame = window.cancelAnimationFrame;
  } else {
    var prefix = ['webkit', 'moz'];

    for (var i = 0, len = prefix.length; i < len; i++) {
      if (typeof window["".concat(prefix, "RequestAnimationFrame")] !== 'undefined') {
        requestAnimationFrame = window["".concat(prefix, "RequestAnimationFrame")];
        cancelAnimationFrame = window["".concat(prefix, "CancelAnimationFrame")];
        break;
      }
    }
  }
}

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
* @return {Number}
*/


function animationAdd(fn) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var prior = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (typeof fn !== 'function') {
    console.warn('no function');
    return;
  }

  var index = animationList.length;

  for (var _i = animationList.length - 1; _i >= 0; _i--) {
    if (animationList[_i].fn === fn) {
      return -1;
    }

    if (prior > animationList[_i].prior) {
      index = _i;
    }
  }

  animationList.splice(index, 0, {
    fn: fn,
    interval: typeof interval === 'number' ? Math.max(0, interval) : 0,
    time: 0,
    key: key,
    prior: prior
  }); // console.info([...animationList])

  return index;
}
/*
* 移除动画函数
* @param {String|Function} key 不传删除所有函数（clean）
* @return {Number}
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
  } // console.info([...animationList])


  return res;
}
/*
 * 开始重复执行requestAnimationFrame
 */


function animationStart() {
  if (!status) {
    status = true;
    animationFrameId = requestAnimationFrame(animationFrame);
  }
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