import { type } from 'emnida';
import { toArray as _toArray, reduce } from 'array-organizer';
import { _assign, _entries } from './polyfill';
import { bindToFunction, deepIterator, getGlobalObject, getNewObject, deepTruly } from './_utils';

const { isPlainObject, isFunction, isArray, isMap, isSet, isObject, isNull } = type;
const globalObject = getGlobalObject();

/**
 * This function converts given iterable object to a plain object
 * @param {Iterable} v Iterable object
 * @param {function} callback Function which will be call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing given function
 * @returns {Object} New plain object
 * @example
 * toPlainObject([1, 2, 3])
 */
export function toPlainObject(v, callback, _this) {
  const _callback = bindToFunction(callback, _this, v => v);

  return reduce(
    v,
    (acc, vv, k) => {
      acc[k] = _callback(vv, k);
      return acc;
    },
    {}
  );
}

/**
 * This function converts given iterable object to a map object
 * @param {Iterable} v Iterable object
 * @param {function} callback Function which will be call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing given function
 * @returns {Map<String, *>} New map object
 * @example
 * toMap([1, 2, 3])
 */
export function toMap(v, callback, _this) {
  if (!isFunction(globalObject.Map)) {
    return null;
  }

  const _callback = bindToFunction(callback, _this, v => v);

  return reduce(
    v,
    (acc, vv, k) => {
      acc.set(k, _callback(vv, k));
      return acc;
    },
    new Map()
  );
}

/**
 * This function converts given iterable object to a set object
 * @param {Iterable} v Iterable object
 * @param {function} callback Function which will be call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing given function
 * @returns {Set<*>} New set object
 * @example
 * toSet([1, 2, 3])
 */
export function toSet(v, callback, _this) {
  if (!isFunction(globalObject.Set)) {
    return null;
  }

  const _callback = bindToFunction(callback, _this, v => v);

  // plain object, map 같은 경우는 { k, v } 형식으로 넣어야할듯하다(지금은 k 를 잃어버린다)
  return reduce(
    v,
    (acc, vv, k) => {
      const result = _callback(vv, k);

      if (isPlainObject(v) || isMap(v)) {
        acc.add({ k, v: result });
      } else {
        acc.add(result);
      }
      return acc;
    },
    new Set()
  );
}

/**
 * This function converts given iterable object to an array object
 * @param {Iterable} v Iterable object
 * @param {function} callback Function which will be call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing given function
 * @returns {Array} New array object
 * @example
 * toArray({ x: 1, y: 2, z: 3 })
 */
export function toArray(v, callback, _this) {
  return _toArray(v, callback, _this);
}

/**
 * This function assigns several source objects to a target object
 * @param {Iterable} target Iterable object
 * @param {Object} args Source objects
 * @returns {Object} New target object
 * @example
 * assign({ x: 1, y: 2, z: new Map([['x', 1]]) }, { xx: 1 }, { yy: 2 }, { zz: 3 })
 */
export function assign(target, ...args) {
  return _assign(toPlainObject(target), ...args);
}

/**
 * This function returns new array object with [key, value] pair
 * @param {Object} v Iterable object
 * @returns {Array} New array object
 * @example
 * entries({ x: 1, y: 2, z: new Map([['x', 1]]) })
 */
export function entries(v) {
  return _entries(toPlainObject(v));
}

/**
 * This function returns all property descriptors of given object
 * @param {Object} v Iterable object
 * @returns {Object} plain object which included all property descriptor
 * @example
 * getPropDescriptors({ x: 1, y: { z: 2 } })
 */
export function getPropDescriptors(v) {
  return Object.keys(v).reduce((acc, k) => {
    acc[k] = Object.getOwnPropertyDescriptor(v, k);
    return acc;
  }, {});
}

/**
 * This function returns new object which shallow copied of given object
 * @param {Object} v Iterable object
 * @param {*} _this Value which will be used as this context when executing given function
 * @returns {Object} New object
 * @example
 * copy(new Set([1, 2, 3]))
 */
export function copy(v, _this) {
  switch (true) {
    // null is object
    case (!isObject(v) && !isFunction(v)) || isNull(v): {
      // Maybe it will be most of primitive type
      return v;
    }
    case isFunction(v): {
      // Any function types(function, async function, generator, async generator ...)
      return v.bind(_this);
    }
    case isPlainObject(v): {
      return _assign({}, v);
    }
    // generator iterable object can not copy
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
 * This function returns new object which deep copied of given object
 * @param {Object} v Iterable object
 * @param {function} callback Function which will be call on every element of iterable object
 * @param {*} _this Value which will be used as this context when executing given function
 * @returns {Object} New object
 * @example
 * deepCopy({
    x: {
      y: new Map([
        ['x', { y: function() {}, z: new Set([1, { x: [1, 2, { y: (function*() {})() }] }]) }],
      ]),
    },
  })
 */
export function deepCopy(v, callback, _this) {
  const _callback = bindToFunction(callback, _this, v => v);
  const set = (c, k, v) => {
    switch (true) {
      case isMap(c): {
        c.set(k, v);
        break;
      }
      case isSet(c): {
        c.add(v);
        break;
      }
      default: {
        c[k] = v;
        break;
      }
    }
    return v;
  };

  return deepIterator(v, {
    fAtNotObject: (v, k, container) => {
      set(container, k, _callback(v, k, container));
    },
    fAtFunction: (v, k, container) => {
      set(container, k, _callback(v.bind(container), k, container));
    },
    fAtObject: (v, k, container) => {
      return set(container, k, getNewObject(v));
    },
    fAtDefault: (v, k, container) => {
      set(container, k, {});
    },
  });
}

/**
 * This function returns new WeakMap object which with all symbol property of given object
 * @param {Object} v Iterable object
 * @returns {WeakMap} New WeakMap object
 * @example
 * deepGetPropSymbols({ [Symbol('x2')]: 1 })
 */
export function deepGetPropSymbols(v) {
  if (
    !isFunction(globalObject.Symbol) ||
    !isFunction(globalObject.WeakMap) ||
    !isFunction(Object.getOwnPropertySymbols)
  ) {
    return null;
  }
  const ret = new Map();
  const getOwnPropertySymbols = vv => {
    const symbols = Object.getOwnPropertySymbols(vv);

    if (symbols.length) {
      ret.set(vv, symbols);
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
 * This function will be deeply freeze of given object
 * @param {Object} v Iterable object
 * @returns {Object}
 * @example
 * deepFreeze({ x: { y: { z: () => {} } } })
 */
export function deepFreeze(v) {
  const freeze = v => {
    Object.freeze(v);
  };

  deepIterator(v, {
    fAtFunction: freeze,
    fAtObject: freeze,
    fAtDefault: freeze,
  });
}

/**
 * This function will be deeply seal of given object
 * @param {Object} v Iterable object
 * @returns {Object}
 * @example
 * deepSeal({ x: { y: { z: () => {} } } })
 */
export function deepSeal(v) {
  const seal = v => {
    Object.seal(v);
  };

  return deepIterator(v, {
    fAtFunction: seal,
    fAtObject: seal,
    fAtDefault: seal,
  });
}

/**
 * This function will be prevent extended of given object
 * @param {Object} v Iterable object
 * @returns {Object}
 * @example
 * deepPreventExtensions({ x: { y: { z: () => {} } } })
 */
export function deepPreventExtensions(v) {
  const prevent = v => {
    Object.preventExtensions(v);
  };

  return deepIterator(v, {
    fAtFunction: prevent,
    fAtObject: prevent,
    fAtDefault: prevent,
  });
}

/**
 * This function returns whether has a property in given object
 * @param {Object} v Iterable object
 * @param {String} k key
 * @returns {Boolean}
 * @example
 * hasProp({ x: { y: { z: () => {} } } }, 'x')
 */
export function hasProp(v, k) {
  return Object.prototype.hasOwnProperty.call(toPlainObject(v), k);
}

/**
 * This function returns whether has a property in given object
 * @param {Object} v Iterable object
 * @param {String} k key
 * @returns {Boolean}
 * @example
 * deepHasProp({ x: { y: { z: () => {}, x: { y: { zz: 1 } } } } }, 'zz')
 */
export function deepHasProp(v, k) {
  const _hasProp = vv => hasProp(vv, k);

  return deepTruly(v, { fAtObject: _hasProp });
}

/**
 * This function returns whether has extensible of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 * @example
 * deepHasExtensible(obj)
 */
export function deepHasExtensible(v) {
  const isNotExtensible = v => !Object.isExtensible(v);

  return !deepTruly(v, { fAtObject: isNotExtensible });
}

/**
 * This function returns whether has freeze of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 * @example
 * deepHasFrozen(obj)
 */
export function deepHasFrozen(v) {
  const isFrozen = v => Object.isFrozen(v);

  return deepTruly(v, { fAtObject: isFrozen });
}

/**
 * This function returns whether seal of given object
 * @param {Object} v Iterable object
 * @returns {Boolean}
 * @example
 * deepHasSealed(obj)
 */
export function deepHasSealed(v) {
  const isSealed = v => Object.isSealed(v);

  return deepTruly(v, { fAtObject: isSealed });
}

/**
 * This function returns whether included a constructor in prototype object
 * @param {Object} v Iterable object
 * @param {Object} c constructor
 * @returns {Boolean}
 * @example
 * hasInstanceOf(obj, constructor)
 */
export function hasInstanceOf(v, c) {
  return v instanceof c;
}

/**
 * This function returns new plain object which included an every arguments
 * @param {*} args Arguments
 * @returns {Object} New plain object
 * @example
 * of(1, 2, 3)
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

/**
 * @private
 */
export { deepTruly };
