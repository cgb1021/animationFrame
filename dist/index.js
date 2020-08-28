function _typeof(n){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}!function(n,t){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((n="undefined"!=typeof globalThis?globalThis:n||self).Animation={})}(this,function(n){"use strict";var r=function(n){return setTimeout(n,1e3/60)},a=clearTimeout;if("undefined"!=typeof window)if(void 0!==window.requestAnimationFrame)r=window.requestAnimationFrame,a=window.cancelAnimationFrame;else for(var t=["webkit","moz"],e=0,o=t.length;e<o;e++)if(void 0!==window["".concat(t,"RequestAnimationFrame")]){r=window["".concat(t,"RequestAnimationFrame")],a=window["".concat(t,"CancelAnimationFrame")];break}var i,u=[],f=!1;function c(){var t=Date.now();u.forEach(function(n){f&&(!n.interval||t-n.time>=n.interval)&&(n.time=t,n.fn(t))}),f&&(i=r(c))}n.animationAdd=function(n){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"",o=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;if("function"==typeof n){for(var i=u.length,f=u.length-1;0<=f;f--){if(u[f].fn===n)return-1;o>u[f].prior&&(i=f)}return u.splice(i,0,{fn:n,interval:"number"==typeof t?Math.max(0,t):0,time:0,key:e,prior:o}),i}},n.animationRemove=function(n){var t=0;if(!n)return t=u.length,u.length=0,t;for(var e=0,o="function"==typeof n?"fn":"key";e<u.length;){u[e][o]!==n?e++:(u.splice(e,1),t++)}return t},n.animationStart=function(){f||(f=!0,i=r(c))},n.animationStop=function(){f=!1,a(i)},n.default=function(n){var e=this,t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;this.interval=Math.max(0,+t)||0;var o=0,i=0,f={fn:"function"==typeof n?n:null,time:0};this.start=function(){"function"==typeof f.fn&&(i||(i=1,this.interval?(f.time=0,function t(){o=r(function(){var n=Date.now();n-f.time>=e.interval&&(f.time=n,f.fn(n)),i&&t()})}()):function n(){o=r(function(){f.fn(Date.now()),i&&n()})}()))},this.stop=function(){i=0,a(o)},this.remove=function(){this.stop(),f.fn=null},this.fn=function(n){"function"==typeof n&&(f.fn=n)}},Object.defineProperty(n,"__esModule",{value:!0})});