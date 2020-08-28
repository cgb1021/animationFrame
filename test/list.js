const { assert } = require('chai') 
const { animationStart, animationStop, animationAdd, animationRemove } = require('../lib/index')

before(function () {
	animationStart()
})
describe('List', function () {
	describe('#animationAdd/animationRemove', function () {
		it('interval传参错误 + animationRemove使用函数', function (done) {
			const timer = 'animationAdd'
			const func = () => {
				done()
				animationRemove(func)
			}
			animationAdd(func, timer)
		})
		it('1秒间隔 + animationRemove使用字符串', function (done) {
			const timer = 'animationAdd'
			const now = Date.now()
			let count = 0
			animationAdd(() => {
				const diff = Date.now() - now
				if (count) {
					animationRemove(timer)
					assert.isAtLeast(diff, 1000, `第2次运行间隔: ${diff}`)
					done()
					return
				}
				assert.isAtMost(diff, 100, `第1次运行间隔: ${diff}`)
				count++
			}, 1000, timer)
		})
		it('animationAdd去重', function (done) {
			const timer = 'doubleadd'
			const now = Date.now()
			let count = 0
			const func = () => {
				const diff = Date.now() - now
				count++
				if (diff >= 500) {
					animationRemove(timer)
					assert.isAtMost(count, 2)
					done()
				}
			}
			animationAdd(func, 1000, timer)
			animationAdd(func, 1000, timer)
			animationAdd(func, 1000, timer)
		})
		it('prior排序', function (done) {
			let count = 0
			const timer = 'priorTimer'
			animationAdd(() => {
				count++
				assert.equal(count, 2, 'prior7')
			}, 1000, timer, 7)
			animationAdd(() => {
				count++
				assert.equal(count, 4, 'prior0-1')
			}, 1000, timer)
			animationAdd(() => {
				count++
				assert.equal(count, 3, 'prior5')
			}, 1000, timer, 5)
			animationAdd(() => {
				count++
				assert.equal(count, 1, 'prior9')
			}, 1000, timer, 9)
			animationAdd(() => {
				count++
				assert.equal(count, 5, 'prior0-2')
				animationRemove(timer)
				done()
			}, 1000, timer)
		})
	})
	describe('#animationStop', function () {
		const now = Date.now()
		let count = 0
		this.timeout(5000)
		it('运行5次后停止', function (done) {
			animationAdd(() => {
				if (count === 4) {
					animationStop()
					const diff = Date.now() - now
					assert.isAtLeast(diff, 4000, `第5次运行间隔: ${diff}`)
					done()
				}
				count++
			}, 1000)
		})
	})
})
