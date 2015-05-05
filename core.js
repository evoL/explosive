"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x2,
    property = _x3,
    receiver = _x4; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _eventemitter3 = require("eventemitter3");

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var State = (function (_EventEmitter) {
  function State() {
    var attributes = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, State);

    _get(Object.getPrototypeOf(State.prototype), "constructor", this).call(this);
    this.initialize(attributes);
  }

  _inherits(State, _EventEmitter);

  _createClass(State, [{
    key: "initialize",
    value: function initialize(attributes) {
      this.attributes = attributes;
    }
  }, {
    key: "set",
    value: function set(object) {
      _objectAssign2["default"](this.attributes, object);
      this.emit("change", this.attributes);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.attributes[key];
    }
  }]);

  return State;
})(_eventemitter32["default"]);

var Explosive = (function (_EventEmitter2) {
  function Explosive() {
    var _this2 = this;

    _classCallCheck(this, Explosive);

    _get(Object.getPrototypeOf(Explosive.prototype), "constructor", this).call(this);

    this._state = new State();
    if (typeof window !== "undefined") {
      this._state.initialize(window._explosiveState || {});
    }

    ["change"].forEach(function (event) {
      _this2._state.on(event, function (state) {
        return _this2.emit("state:" + event, state);
      });
    });
  }

  _inherits(Explosive, _EventEmitter2);

  _createClass(Explosive, [{
    key: "initializeState",
    value: function initializeState(attributes) {
      this._state.initialize(attributes);
      return this;
    }
  }, {
    key: "state",
    value: function state() {
      return this._state.attributes;
    }
  }, {
    key: "setState",
    value: function setState(object) {
      this._state.set(object);
      return this;
    }
  }, {
    key: "loadFinished",
    value: function loadFinished() {
      this.emit("load:finish");
      return this;
    }
  }]);

  return Explosive;
})(_eventemitter32["default"]);

var instance = new Explosive();
exports["default"] = instance;
module.exports = exports["default"];