let requestAnimationFrame = function (callback) {
    return setTimeout(callback, 1000 / 60);
}
let cancelAnimationFrame = clearTimeout
if (typeof window !== 'undefined') {
  if (typeof window.requestAnimationFrame !== 'undefined') {
    requestAnimationFrame = window.requestAnimationFrame;
    cancelAnimationFrame = window.cancelAnimationFrame;
  } else {
    const prefix = ['webkit', 'moz'];
    for (let i = 0, len = prefix.length; i < len; i++) {
      if (typeof window[`${prefix}RequestAnimationFrame`] !== 'undefined') {
        requestAnimationFrame = window[`${prefix}RequestAnimationFrame`];
        cancelAnimationFrame = window[`${prefix}CancelAnimationFrame`];
        break;
      }
    }
  }
}
const animationList = [];
let animationFrameId;
let status = false
function animationFrame() {
    const time = Date.now();
    animationList.forEach((item) => {
        if (status && (!item.interval || (time - item.time) >= item.interval)) {
            item.time = time;
            item.fn(time);
        }
    })
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
export function animationAdd (fn, interval = 0, key = '', prior = 0) {
      if (typeof fn !== 'function') {
        console.warn('no function');
        return;
      }
      let index = animationList.length;
      for (let i = animationList.length - 1; i >= 0 ; i--) {
        if (animationList[i].fn === fn) {
          return -1;
        }
        if (prior > animationList[i].prior) {
          index = i;
        }
      }
      animationList.splice(index, 0, {
        fn,
        interval: typeof interval === 'number' ? Math.max(0, interval) : 0,
        time: 0,
        key,
        prior
      })
      // console.info([...animationList])
      return index;
}
/*
* 移除动画函数
* @param {String|Function} key 不传删除所有函数（clean）
* @return {Number}
*/
export function animationRemove (key) {
    let res = 0
    if (!key) {
        res = animationList.length;
        animationList.length = 0;
        return res;
    }
    let i = 0;
    const itemKey = typeof key === 'function' ? 'fn' : 'key'
    while (i < animationList.length) {
        const item = animationList[i];
        if (item[itemKey] === key) {
            animationList.splice(i, 1)
            res++;
            continue;
        }
        i++;
    }
    // console.info([...animationList])
    return res;
}
/*
 * 开始重复执行requestAnimationFrame
 */
export function animationStart () {
    if (!status) {
      status = true
      animationFrameId = requestAnimationFrame(animationFrame)
    }
}
/*
 * 停止执行requestAnimationFrame
 */
export function animationStop () {
    status = false
    cancelAnimationFrame(animationFrameId)
}
/*
 * 执行requestAnimationFrame对象{start, stop, remove, fn}
 * @param {Function} fn
 * @param {Number} interval 执行间隔
 */
function Animation (fn, interval = 0) {
  this.interval = Math.max(0, +interval) || 0;
  let frameId = 0;
  let status = 0;
  const frameItem = {
    fn: typeof fn === 'function' ? fn : null,
    time: 0
  }
  const _frame1 = () => {
    frameId = requestAnimationFrame(() => {
      frameItem.fn(Date.now());
      if (status) _frame1();
    })
  }
  const _frame2 = () => {
    frameId = requestAnimationFrame(() => {
      const now = Date.now();
      if (now - frameItem.time >= this.interval) {
        frameItem.time = now;
        frameItem.fn(now);
      }
      if (status) _frame2();
    })
  }
  this.start = function () {
    if (typeof frameItem.fn !== 'function') {
      console.warn('no function');
      return;
    }
    if (status) return;
    status = 1;
    if (this.interval) {
      frameItem.time = 0;
      _frame2();
    } else {
      _frame1();
    }
  }
  this.stop = function () {
    status = 0;
    cancelAnimationFrame(frameId);
  }
  this.remove = function () {
    this.stop();
    frameItem.fn = null;
  }
  this.fn = function (fn) {
    if (typeof fn === 'function') {
      frameItem.fn = fn;
    }
  }
}
export default Animation;
