import { type } from 'emnida';
import { toArray as _toArray, reduce } from 'array-organizer';
import { _assign, _entries } from './polyfill';
import { bindToFunction, deepIterator, deepTruly, getGlobalObject } from './_utils';

const { isPlainObject, isFunction, isArray, isMap, isSet, isObject, isNull } = type;
const globalObject = getGlobalObject();

/**
 * This function convert iterable object to plain object
 * @param {Iterable} v Iterable object
 * @param {function} f Function which will call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing function
 * @returns {Object}
 */
export function toPlainObject(v, f, _this) {
  const _f = bindToFunction(f, _this, v => v);

  return reduce(
    v,
    (acc, vv, k) => {
      acc[k] = _f(vv, k);
      return acc;
    },
    {}
  );
}

/**
 * This function convert iterable object to Map object
 * @param {Iterable} v Iterable object
 * @param {function} f Function which will call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing function
 * @returns {Object}
 */
export function toMap(v, f, _this) {
  const _f = bindToFunction(f, _this, v => v);

  return reduce(
    v,
    (acc, vv, k) => {
      acc.set(k, _f(vv, k));
      return acc;
    },
    new Map()
  );
}

/**
 * This function convert iterable object to Set object
 * @param {Iterable} v Iterable object
 * @param {function} f Function which will call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing function
 * @returns {Object}
 */
export function toSet(v, f, _this) {
  const _f = bindToFunction(f, _this, v => v);

  return reduce(
    v,
    (acc, vv, k) => {
      acc.add(k, _f(vv, k));
      return acc;
    },
    new Set()
  );
}

/**
 * This function convert iterable object to Array object
 * @param {Iterable} v Iterable object
 * @param {function} f Function which will call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing function
 * @returns {Object}
 */
export function toArray(v, f, _this) {
  return _toArray(v, f, _this);
}

/**
 * This function assign source object to target object
 * @param {Object} t target object
 * @param {Object} args source objects
 * @returns {Object}
 */
export function assign(t, ...args) {
  return _assign(toPlainObject(t), ...args);
}

/**
 * This function return an array object with [key, value] pair
 * @param {Object} v iterable object
 * @returns {Object}
 */
export function entries(v) {
  return _entries(toPlainObject(v));
}

/**
 * This function return all own property descriptors of given object
 * @param {Object} v iterable object
 * @returns {Object}
 */
export function getPropDescriptors(v) {
  return Object.keys(v).reduce((acc, k) => {
    acc[k] = Object.getOwnPropertyDescriptor(v, k);
    return acc;
  }, {});
}

/**
 * This function return an object which shallow copied of given object
 * @param {Object} v iterable object
 * @param {*} _this Value which will be used as this context when executing function
 * @returns {Object}
 */
export function copy(v, _this) {
  switch (true) {
    // null is object
    case !isObject(v) || isNull(v): {
      // Maybe it will be most of primitive type
      return v;
    }
    case isFunction(v): {
      // Any function types(function, async function, generator, async generator ...)
      return v.bind(_this);
    }
    case isPlainObject(v): {
      return Object.assign({}, v);
    }
    case isArray(v) || isMap(v) || isSet(v): {
      switch (true) {
        case isMap(v): {
          const newMap = new Map();
          _toArray(v, (v, k) => newMap.set(k, v));
          return newMap;
        }
        case isSet(v): {
          const newSet = new Set();
          _toArray(v, v => newSet.add(v));
          return newSet;
        }
        default:
          return _toArray(v);
      }
    }
    default: {
      return {};
    }
  }
}

/**
 * This function return an object which deep copied of given object
 * @param {Object} v iterable object
 * @param {function} f Function which will call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing function
 * @returns {Object}
 */
export function deepCopy(v, f, _this) {
  const _f = bindToFunction(f, _this, v => v);
  const set = (c, k, v) => {
    if (isMap(c)) {
      return c.set(k, v);
    }
    if (isSet(c)) {
      return c.add(v);
    }
    c[k] = v;
  };

  return deepIterator(v, {
    fAtNotObject: (v, k, container) => {
      set(container, k, _f(v, k, container));
    },
    fAtFunction: (v, k, container) => {
      set(container, k, _f(v.bind(container), k, container));
    },
    fAtObject: (v, k, container, newContainer) => {
      set(container, k, newContainer);
    },
    fAtDefault: (v, k, container) => {
      set(container, k, {});
    },
  });
}

/**
 * This function return an array object which with all symbol properties from given object
 * @param {Object} v Iterable object
 * @returns {WeakMap}
 */
export function deepGetPropSymbols(v) {
  if (
    !isFunction(globalObject.Symbol) ||
    !isFunction(globalObject.WeakMap) ||
    !isFunction(Object.getOwnPropertySymbols)
  ) {
    return null;
  }
  const ret = new WeakMap();
  const getOwnPropertySymbols = (vv, k, c) => {
    const symbols = Object.getOwnPropertySymbols(vv);

    if (symbols.length) {
      ret.set(c, k);
    }
  };

  deepIterator(v, {
    fAtNotObject: getOwnPropertySymbols,
    fAtFunction: getOwnPropertySymbols,
    fAtObject: getOwnPropertySymbols,
    fAtDefault: getOwnPropertySymbols,
  });
  return ret;
}

/**
 * This function will be deep frozen of given object
 * @param {Object} v Iterable object
 * @returns {WeakMap}
 */
export function deepFreeze(v) {
  const freeze = v => Object.freeze(v);
  deepIterator(v, { fAtFunction: freeze, fAtObject: freeze, fAtDefault: freeze });
}

/**
 * This function will be deep sealed of given object
 * @param {Object} v Iterable object
 * @returns {WeakMap}
 */
export function deepSeal(v) {
  const seal = v => Object.seal(v);
  deepIterator(v, { fAtFunction: seal, fAtObject: seal, fAtDefault: seal });
}

/**
 * This function will be prevent deep extended of given object
 * @param {Object} v Iterable object
 * @returns {WeakMap}
 */
export function deepPreventExtensions(v) {
  const prevent = v => Object.preventExtensions(v);
  deepIterator(v, { fAtFunction: prevent, fAtObject: prevent, fAtDefault: prevent });
}

/**
 * This function return whether has property in given object
 * @param {Object} v Iterable object
 * @param {String} k property name
 * @returns {Boolean}
 */
export function hasProp(v, k) {
  return Object.prototype.hasOwnProperty.call(toPlainObject(v), k);
}

/**
 * This function return whether has property in given object
 * @param {Object} v Iterable object
 * @param {String} k property name
 * @returns {Boolean}
 */
export function deepHas(v, k) {
  const _hasProp = vv => hasProp(vv, k);
  return deepTruly(v, { fAtObject: _hasProp });
}

/**
 * This function return whether has extensible of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 */
export function deepHasExtensible(v) {
  const isExtensible = v => {
    return Object.isExtensible(v);
  };
  return deepTruly(v, { fAtObject: isExtensible });
}

/**
 * This function return whether has frozen of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 */
export function deepHasFrozen(v) {
  const isFrozen = v => {
    return Object.isFrozen(v);
  };
  return deepTruly(v, { fAtObject: isFrozen });
}

/**
 * This function return whether has sealed of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 */
export function deepHasSealed(v) {
  const isSealed = v => {
    return Object.isSealed(v);
  };
  return deepTruly(v, { fAtObject: isSealed });
}

/**
 * This function return an array object which included all keys of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 */
export function deepKeys(v) {
  const ret = {};
  const getObjectKeys = vv => {
    const keys = [];
    toPlainObject(vv, (_, k) => {
      keys.push(k);
    });
    ret[vv] = keys;
  };

  deepIterator(v, {
    fAtFunction: getObjectKeys,
    fAtObject: getObjectKeys,
    fAtDefault: getObjectKeys,
  });
  return ret;
}

/**
 * This function return an array object which included all values of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 */
export function deepValues(v) {
  const ret = {};
  const getObjectValues = vv => {
    const values = [];

    toPlainObject(vv, _v => {
      values.push(_v);
    });
    ret[vv] = values;
  };

  deepIterator(v, {
    fAtFunction: getObjectValues,
    fAtObject: getObjectValues,
    fAtDefault: getObjectValues,
  });
  return ret;
}

/**
 * This function return whether included a constructor in prototype object
 * @param {Object} v Iterable object
 * @param {Object} c constructor
 * @returns {Boolean}
 */
export function hasInstanceOf(v, c) {
  return v instanceof c;
}

/**
 * This function return whether included a constructor in prototype object
 * @param {Object} v Iterable object
 * @param {Object} c constructor
 * @returns {Boolean}
 */
export function deepHasInstanceOf(v, c) {
  const _hasInstanceOf = vv => hasInstanceOf(vv, c);
  return deepTruly(v, { fAtObject: _hasInstanceOf });
}

/**
 * This function return new plain object which included an every arguments
 * @param {*} args Arguments
 * @returns {Object}
 * @example
 */
export function of(...args) {
  return reduce(
    args,
    (acc, vv, k) => {
      acc[k] = vv;
      return acc;
    },
    {}
  );
}
