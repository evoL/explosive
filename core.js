"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _eventemitter3 = require("eventemitter3");

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var State = (function () {
  function State(parent) {
    _classCallCheck(this, State);

    this.parent = parent;
    this.attributes = {};
  }

  _createClass(State, [{
    key: "initialize",
    value: function initialize(attributes) {
      this.attributes = attributes;
    }
  }, {
    key: "set",
    value: function set(object) {
      _objectAssign2["default"](this.attributes, object);
      this.parent.emit("state:change", this.attributes);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.attributes[key];
    }
  }]);

  return State;
})();

var Explosive = (function (_EventEmitter) {
  function Explosive() {
    _classCallCheck(this, Explosive);

    _get(Object.getPrototypeOf(Explosive.prototype), "constructor", this).call(this);

    this._state = new State(this);
    if (typeof window !== "undefined") {
      this._state.initialize(window._explosiveState || {});
    }
  }

  _inherits(Explosive, _EventEmitter);

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
    key: "set",
    value: function set(object) {
      this._state.set(object);
      return this;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._state.get(key);
    }
  }, {
    key: "loadFinished",
    value: function loadFinished() {
      this.emit("load:finish");
      return this;
    }
  }, {
    key: "notFound",
    value: function notFound() {
      this.emit("page:not_found");
      return this;
    }
  }]);

  return Explosive;
})(_eventemitter32["default"]);

var instance = new Explosive();
exports["default"] = instance;
module.exports = exports["default"];