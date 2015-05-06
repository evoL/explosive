import instance from "./core";

export default function(method, ...args) {
  if (typeof method === 'undefined')
    return instance;

  if (typeof instance[method] !== "function") {
    throw new Error(`Invalid method: ${method}`);
  }

  return instance[method].apply(instance, args);
}
