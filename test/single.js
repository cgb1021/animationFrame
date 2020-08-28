import { assert } from 'chai'
import Animation from '../index'
describe('Single', function () {
	describe('#new/start/stop', function () {
		it('创建对象', function (done) {
			let count = 0
			const animation = new Animation(() => {
				count++
				if (count === 2) {
					animation.stop()
					done()
					return
				}
				assert.equal(count, 1, '第一次运行')
			})
			assert.isObject(animation)
			animation.start()
		})
		it('remove', function (done) {
			const animation = new Animation(() => {
				animation.remove()
				done()
				// animation.start();
			})
			animation.start()
		})
		it('fn', function (done) {
			let count = 0
			const animation = new Animation(() => {
				assert.notEqual(count, 0, '不应该运行')
				animation.stop()
				done()
			})
			animation.fn(() => {
				count++
				animation.stop()
				done()
			})
			animation.start()
		})
	})
	describe('#interval', function () {
		it('运行3次', function (done) {
			this.timeout(4000)
			let count = 0
			const now = Date.now()
			const animation = new Animation(() => {
				count++
				if (count === 3) {
					const diff = Date.now() - now
					assert.isAtLeast(diff, 2000, `3次运行间隔: ${diff}`)
					animation.stop()
					done()
				}
			}, 1000)
			animation.start()
		})
	})
})