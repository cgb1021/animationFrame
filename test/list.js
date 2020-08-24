const assert = require('chai').assert;
const { animationStart, animationStop, animationAdd, animationRemove } = require('../index');

before(function () {
  animationStart();
});
describe('List', function () {
  describe('#animationAdd()', function () {
    const timer = 'animationAdd'
    const now = Date.now()
    it('interval传参错误', function (done) {
      animationAdd(() => {
        done();
      }, timer)
    });
    let count = 0
    it('1秒间隔', function (done) {
      animationAdd(() => {
        const diff = Date.now() - now;
        if (count) {
          animationRemove(timer);
          assert.isAtLeast(diff, 999, `间隔时间: ${diff}`);
          assert.equal(count, 1, `第2次运行`);
          done();
          return;
        }
        assert.isAtMost(diff, 50, `间隔时间: ${diff}`);
        assert.equal(count, 0, `第一次运行`);
        count++;
      }, 1000, timer)
    });
  });
});
after(function () {
  animationStop()
})
