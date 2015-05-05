"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _explosive = require("./explosive");

var _explosive2 = _interopRequireDefault(_explosive);

if (typeof window !== "undefined" && typeof window.explosive === "undefined") {
  window.explosive = _explosive2["default"];
}