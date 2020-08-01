const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 1000 / 60);
}
const cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.clearTimeout
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
*/
export function animationAdd (fn, interval = 0, key = '', prior = 0) {
    if (typeof fn !== 'function') return;
    let i = 0;
    for (let len = animationList.length; i < len; i++) {
        if (prior > animationList[i].prior) {
            break;
        }
    }
    animationList.splice(i, 0, {
        fn,
        interval,
        time: 0,
        key,
        prior
    })
}
/*
* 移除动画函数
* @param {String|Function} key 不传删除所有函数（clean）
*/
export function animationRemove (key) {
    if (!key) {
        animationList.length = 0;
        return;
    }
    let i = 0;
    for (let len = animationList.length; i < len; i++) {
        const item = animationList[i];
        if (item.key === key || item.fn === key) {
            break;
        }
    }
    animationList.splice(i, 1);
}
/*
 * 开始重复执行requestAnimationFrame
 */
export function animationStart () {
    status = true
    animationFrameId = requestAnimationFrame(animationFrame)
}
/*
 * 停止执行requestAnimationFrame
 */
export function animationStop () {
    status = false
    cancelAnimationFrame(animationFrameId)
}
export default {
    add: animationAdd,
    remove: animationRemove,
    start: animationStart,
    stop: animationStop
}
