"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _core = require("./core");

var _core2 = _interopRequireDefault(_core);

exports["default"] = function (method) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (typeof method === "undefined") return _core2["default"];

  if (typeof _core2["default"][method] !== "function") {
    throw new Error("Invalid method: " + method);
  }

  return _core2["default"][method].apply(_core2["default"], args);
};

module.exports = exports["default"];