```js
npm i rq-animation
```

一个对requestAnimationFrame的封装。

使用方法：

```js
import animation from 'rq-animation'
// import { animationAdd, animationStop, animationAdd, animationRemove } from 'rq-animation'

// requestAnimationFrame loops start
animation.start()
animation.add(() => {
	console.log('Running every animation frame')
})
animation.add(() => {
	console.log('It will run every 5sec')
}, 5000)
animation.add(() => {
	console.log('It will remove itself')
	animation.remove('third')
}, 1000, 'third')
animation.add(() => {
	console.log('The function is in the front of animation list')
}, 1000, '', 9)
animation.add(() => {
	console.log('Animation stop')
	animation.stop()
}, 10000)
```

