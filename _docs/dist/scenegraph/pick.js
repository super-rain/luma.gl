'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickModels = pickModels;

var _webgl = require('../webgl');

var _webglChecks = require('../webgl/webgl-checks');

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO - this is the new picking for deck.gl
/* eslint-disable max-statements, no-try-catch */
var ILLEGAL_ARG = 'Illegal argument to pick';

function pickModels(gl, _ref) {
  var group = _ref.group;
  var camera = _ref.camera;
  var viewMatrix = _ref.viewMatrix;
  var x = _ref.x;
  var y = _ref.y;
  var _ref$pickingFBO = _ref.pickingFBO;
  var pickingFBO = _ref$pickingFBO === undefined ? null : _ref$pickingFBO;
  var _ref$pickingProgram = _ref.pickingProgram;
  var pickingProgram = _ref$pickingProgram === undefined ? null : _ref$pickingProgram;
  var _ref$pickingColors = _ref.pickingColors;
  var pickingColors = _ref$pickingColors === undefined ? null : _ref$pickingColors;

  (0, _webglChecks.assertWebGLRenderingContext)(gl);
  (0, _assert2.default)(group instanceof _group2.default, ILLEGAL_ARG);
  (0, _assert2.default)(Array.isArray(viewMatrix), ILLEGAL_ARG);

  // Set up a frame buffer if needed
  // TODO - cache picking fbo (needs to be resized)?
  pickingFBO = pickingFBO || new _webgl.FramebufferObject(gl, {
    width: gl.canvas.width,
    height: gl.canvas.height
  });

  var picked = [];

  // Make sure we clear scissor test and fbo bindings in case of exceptions
  (0, _webgl.glContextWithState)(gl, {
    frameBuffer: pickingFBO,
    // We are only interested in one pixel, no need to render anything else
    scissorTest: { x: x, y: gl.canvas.height - y, w: 1, h: 1 }
  }, function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = group.traverseReverse({ viewMatrix: viewMatrix })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var model = _step.value;

        if (model.isPickable()) {

          // Clear the frame buffer, render and sample
          gl.clear(_webgl.GL.COLOR_BUFFER_BIT | _webgl.GL.DEPTH_BUFFER_BIT);
          model.setUniforms({ renderPickingBuffer: 1 });
          model.render(gl, { camera: camera, viewMatrix: viewMatrix });
          model.setUniforms({ renderPickingBuffer: 0 });

          // Read color in the central pixel, to be mapped with picking colors
          var color = new Uint8Array(4);
          gl.readPixels(x, gl.canvas.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);

          var isPicked = color[0] !== 0 || color[1] !== 0 || color[2] !== 0 || color[3] !== 0;

          // Add the information to the stack
          picked.push({ model: model, color: color, isPicked: isPicked });
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });

  return picked;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2VuZWdyYXBoL3BpY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFTZ0IsVSxHQUFBLFU7O0FBUGhCOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUxBO0FBQ0E7QUFNQSxJQUFNLGNBQWMsMEJBQXBCOztBQUVPLFNBQVMsVUFBVCxDQUFvQixFQUFwQixRQVNKO0FBQUEsTUFSRCxLQVFDLFFBUkQsS0FRQztBQUFBLE1BUEQsTUFPQyxRQVBELE1BT0M7QUFBQSxNQU5ELFVBTUMsUUFORCxVQU1DO0FBQUEsTUFMRCxDQUtDLFFBTEQsQ0FLQztBQUFBLE1BSkQsQ0FJQyxRQUpELENBSUM7QUFBQSw2QkFIRCxVQUdDO0FBQUEsTUFIRCxVQUdDLG1DQUhZLElBR1o7QUFBQSxpQ0FGRCxjQUVDO0FBQUEsTUFGRCxjQUVDLHVDQUZnQixJQUVoQjtBQUFBLGdDQURELGFBQ0M7QUFBQSxNQURELGFBQ0Msc0NBRGUsSUFDZjs7QUFDRCxnREFBNEIsRUFBNUI7QUFDQSx3QkFBTyxnQ0FBUCxFQUErQixXQUEvQjtBQUNBLHdCQUFPLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBUCxFQUFrQyxXQUFsQzs7QUFFQTtBQUNBO0FBQ0EsZUFBYSxjQUFjLDZCQUFzQixFQUF0QixFQUEwQjtBQUNuRCxXQUFPLEdBQUcsTUFBSCxDQUFVLEtBRGtDO0FBRW5ELFlBQVEsR0FBRyxNQUFILENBQVU7QUFGaUMsR0FBMUIsQ0FBM0I7O0FBS0EsTUFBTSxTQUFTLEVBQWY7O0FBRUE7QUFDQSxpQ0FBbUIsRUFBbkIsRUFBdUI7QUFDckIsaUJBQWEsVUFEUTtBQUVyQjtBQUNBLGlCQUFhLEVBQUMsSUFBRCxFQUFJLEdBQUcsR0FBRyxNQUFILENBQVUsTUFBVixHQUFtQixDQUExQixFQUE2QixHQUFHLENBQWhDLEVBQW1DLEdBQUcsQ0FBdEM7QUFIUSxHQUF2QixFQUlHLFlBQU07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDUCwyQkFBb0IsTUFBTSxlQUFOLENBQXNCLEVBQUMsc0JBQUQsRUFBdEIsQ0FBcEIsOEhBQXlEO0FBQUEsWUFBOUMsS0FBOEM7O0FBQ3ZELFlBQUksTUFBTSxVQUFOLEVBQUosRUFBd0I7O0FBRXRCO0FBQ0EsYUFBRyxLQUFILENBQVMsVUFBRyxnQkFBSCxHQUFzQixVQUFHLGdCQUFsQztBQUNBLGdCQUFNLFdBQU4sQ0FBa0IsRUFBQyxxQkFBcUIsQ0FBdEIsRUFBbEI7QUFDQSxnQkFBTSxNQUFOLENBQWEsRUFBYixFQUFpQixFQUFDLGNBQUQsRUFBUyxzQkFBVCxFQUFqQjtBQUNBLGdCQUFNLFdBQU4sQ0FBa0IsRUFBQyxxQkFBcUIsQ0FBdEIsRUFBbEI7O0FBRUE7QUFDQSxjQUFNLFFBQVEsSUFBSSxVQUFKLENBQWUsQ0FBZixDQUFkO0FBQ0EsYUFBRyxVQUFILENBQ0UsQ0FERixFQUNLLEdBQUcsTUFBSCxDQUFVLE1BQVYsR0FBbUIsQ0FEeEIsRUFDMkIsQ0FEM0IsRUFDOEIsQ0FEOUIsRUFDaUMsR0FBRyxJQURwQyxFQUMwQyxHQUFHLGFBRDdDLEVBQzRELEtBRDVEOztBQUlBLGNBQU0sV0FDSixNQUFNLENBQU4sTUFBYSxDQUFiLElBQWtCLE1BQU0sQ0FBTixNQUFhLENBQS9CLElBQW9DLE1BQU0sQ0FBTixNQUFhLENBQWpELElBQXNELE1BQU0sQ0FBTixNQUFhLENBRHJFOztBQUdBO0FBQ0EsaUJBQU8sSUFBUCxDQUFZLEVBQUMsWUFBRCxFQUFRLFlBQVIsRUFBZSxrQkFBZixFQUFaO0FBQ0Q7QUFDRjtBQXRCTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdUJSLEdBM0JEOztBQTZCQSxTQUFPLE1BQVA7QUFDRCIsImZpbGUiOiJwaWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETyAtIHRoaXMgaXMgdGhlIG5ldyBwaWNraW5nIGZvciBkZWNrLmdsXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cywgbm8tdHJ5LWNhdGNoICovXG5pbXBvcnQge0dMLCBnbENvbnRleHRXaXRoU3RhdGUsIEZyYW1lYnVmZmVyT2JqZWN0fSBmcm9tICcuLi93ZWJnbCc7XG5pbXBvcnQge2Fzc2VydFdlYkdMUmVuZGVyaW5nQ29udGV4dH0gZnJvbSAnLi4vd2ViZ2wvd2ViZ2wtY2hlY2tzJztcbmltcG9ydCBHcm91cCBmcm9tICcuL2dyb3VwJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcblxuY29uc3QgSUxMRUdBTF9BUkcgPSAnSWxsZWdhbCBhcmd1bWVudCB0byBwaWNrJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBpY2tNb2RlbHMoZ2wsIHtcbiAgZ3JvdXAsXG4gIGNhbWVyYSxcbiAgdmlld01hdHJpeCxcbiAgeCxcbiAgeSxcbiAgcGlja2luZ0ZCTyA9IG51bGwsXG4gIHBpY2tpbmdQcm9ncmFtID0gbnVsbCxcbiAgcGlja2luZ0NvbG9ycyA9IG51bGxcbn0pIHtcbiAgYXNzZXJ0V2ViR0xSZW5kZXJpbmdDb250ZXh0KGdsKTtcbiAgYXNzZXJ0KGdyb3VwIGluc3RhbmNlb2YgR3JvdXAsIElMTEVHQUxfQVJHKTtcbiAgYXNzZXJ0KEFycmF5LmlzQXJyYXkodmlld01hdHJpeCksIElMTEVHQUxfQVJHKTtcblxuICAvLyBTZXQgdXAgYSBmcmFtZSBidWZmZXIgaWYgbmVlZGVkXG4gIC8vIFRPRE8gLSBjYWNoZSBwaWNraW5nIGZibyAobmVlZHMgdG8gYmUgcmVzaXplZCk/XG4gIHBpY2tpbmdGQk8gPSBwaWNraW5nRkJPIHx8IG5ldyBGcmFtZWJ1ZmZlck9iamVjdChnbCwge1xuICAgIHdpZHRoOiBnbC5jYW52YXMud2lkdGgsXG4gICAgaGVpZ2h0OiBnbC5jYW52YXMuaGVpZ2h0XG4gIH0pO1xuXG4gIGNvbnN0IHBpY2tlZCA9IFtdO1xuXG4gIC8vIE1ha2Ugc3VyZSB3ZSBjbGVhciBzY2lzc29yIHRlc3QgYW5kIGZibyBiaW5kaW5ncyBpbiBjYXNlIG9mIGV4Y2VwdGlvbnNcbiAgZ2xDb250ZXh0V2l0aFN0YXRlKGdsLCB7XG4gICAgZnJhbWVCdWZmZXI6IHBpY2tpbmdGQk8sXG4gICAgLy8gV2UgYXJlIG9ubHkgaW50ZXJlc3RlZCBpbiBvbmUgcGl4ZWwsIG5vIG5lZWQgdG8gcmVuZGVyIGFueXRoaW5nIGVsc2VcbiAgICBzY2lzc29yVGVzdDoge3gsIHk6IGdsLmNhbnZhcy5oZWlnaHQgLSB5LCB3OiAxLCBoOiAxfVxuICB9LCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBtb2RlbCBvZiBncm91cC50cmF2ZXJzZVJldmVyc2Uoe3ZpZXdNYXRyaXh9KSkge1xuICAgICAgaWYgKG1vZGVsLmlzUGlja2FibGUoKSkge1xuXG4gICAgICAgIC8vIENsZWFyIHRoZSBmcmFtZSBidWZmZXIsIHJlbmRlciBhbmQgc2FtcGxlXG4gICAgICAgIGdsLmNsZWFyKEdMLkNPTE9SX0JVRkZFUl9CSVQgfCBHTC5ERVBUSF9CVUZGRVJfQklUKTtcbiAgICAgICAgbW9kZWwuc2V0VW5pZm9ybXMoe3JlbmRlclBpY2tpbmdCdWZmZXI6IDF9KTtcbiAgICAgICAgbW9kZWwucmVuZGVyKGdsLCB7Y2FtZXJhLCB2aWV3TWF0cml4fSk7XG4gICAgICAgIG1vZGVsLnNldFVuaWZvcm1zKHtyZW5kZXJQaWNraW5nQnVmZmVyOiAwfSk7XG5cbiAgICAgICAgLy8gUmVhZCBjb2xvciBpbiB0aGUgY2VudHJhbCBwaXhlbCwgdG8gYmUgbWFwcGVkIHdpdGggcGlja2luZyBjb2xvcnNcbiAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICAgICAgZ2wucmVhZFBpeGVscyhcbiAgICAgICAgICB4LCBnbC5jYW52YXMuaGVpZ2h0IC0geSwgMSwgMSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgY29sb3JcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBpc1BpY2tlZCA9XG4gICAgICAgICAgY29sb3JbMF0gIT09IDAgfHwgY29sb3JbMV0gIT09IDAgfHwgY29sb3JbMl0gIT09IDAgfHwgY29sb3JbM10gIT09IDA7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBpbmZvcm1hdGlvbiB0byB0aGUgc3RhY2tcbiAgICAgICAgcGlja2VkLnB1c2goe21vZGVsLCBjb2xvciwgaXNQaWNrZWR9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwaWNrZWQ7XG59XG4iXX0=