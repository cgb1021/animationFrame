```js
npm i rq-animation
```

一个对requestAnimationFrame的封装。

使用方法：

```js
import animation, { animationAdd, animationStop, animationAdd, animationRemove } from 'rq-animation'
// animation处理requestAnimationFrame单个回调
// { animationAdd, animationStop, animationAdd, animationRemove }处理requestAnimationFrame回调队列

// requestAnimationFrame loops start
const frame = new animation(() => {
    console.log('animation callback')
}, 0)
frame.start()

animationAdd(() => {
	console.log('Running every animation frame')
})
animationAdd(() => {
	console.log('It will run every 5sec')
}, 5000)
animationAdd(() => {
	console.log('It will remove itself')
	animationRemove('third')
}, 1000, 'third')
animationAdd(() => {
	console.log('The function is in the front of animation list')
}, 1000, '', 9)
animationAdd(() => {
	console.log('Animation stop')
	animationStop()
}, 10000)
```

