import EventEmitter from "eventemitter3";
import assign from "object-assign";

class State {
  constructor(parent) {
    this.parent = parent;
    this.attributes = {};
  }

  initialize(attributes) {
    this.attributes = attributes;
  }

  set(object) {
    assign(this.attributes, object);
    this.parent.emit('state:change', this.attributes);
  }

  get(key) {
    return this.attributes[key];
  }
}

class Explosive extends EventEmitter {
  constructor() {
    super();

    this._state = new State(this);
    if (typeof window !== 'undefined') {
      this._state.initialize(window._explosiveState || {});
    }
  }

  initializeState(attributes) {
    this._state.initialize(attributes);
    return this;
  }

  state() {
    return this._state.attributes;
  }

  set(object) {
    this._state.set(object);
    return this;
  }

  get(key) {
    return this._state.get(key);
  }

  loadFinished() {
    this.emit('load:finish');
    return this;
  }

  notFound() {
    this.emit('page:not_found');
    return this;
  }
}

var instance = new Explosive;
export default instance;
