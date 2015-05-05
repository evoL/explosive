import EventEmitter from "eventemitter3";
import assign from "object-assign";

class State extends EventEmitter {
  constructor(attributes={}) {
    super();
    this.initialize(attributes);
  }

  initialize(attributes) {
    this.attributes = attributes;
  }

  set(object) {
    assign(this.attributes, object);
    this.emit('change', this.attributes);
  }

  get(key) {
    return this.attributes[key];
  }
}

class Explosive extends EventEmitter {
  constructor() {
    super();

    this._state = new State();
    if (typeof window !== 'undefined') {
      this._state.initialize(window._explosiveState || {});
    }

    ['change'].forEach((event) => {
      this._state.on(event, (state) => this.emit('state:' + event, state));
    });
  }

  initializeState(attributes) {
    this._state.initialize(attributes);
    return this;
  }

  state() {
    return this._state.attributes;
  }

  setState(object) {
    this._state.set(object);
    return this;
  }

  loadFinished() {
    this.emit('load:finish');
    return this;
  }
}

var instance = new Explosive;
export default instance;
