import { type } from 'emnida';
import {
  forEach,
  toArray,
  reduce,
  keys,
  values,
  of,
  indexOf,
  join,
  lastIndexOf,
  find,
  findIndex,
  deepFind,
  includes,
  asc,
  desc,
  ascBy,
  descBy,
  insert as _insert,
  replace as _replace,
  remove as _remove,
  removeAll as _removeAll,
  unshift as _unshift,
  push as _push,
  insertBefore as _insertBefore,
  insertAfter as _insertAfter,
} from 'array-organizer';
import { _assign, _entries } from './polyfill';
import { bindToFunction, getGlobalObject } from './_utils';

const {
  isPlainObject,
  isFunction,
  isArray,
  isMap,
  isSet,
  isObject,
  isNull,
  isArrayLikeObject,
  isIterableObject,
} = type;
const globalObject = getGlobalObject();

function getNewObject(v) {
  switch (true) {
    case isPlainObject(v): {
      return {};
    }
    case isArray(v) || isMap(v) || isSet(v): {
      if (isMap(v)) {
        return new Map();
      }
      if (isSet(v)) {
        return new Set();
      }
      return [];
    }
    default: {
      return {};
    }
  }
}

function deepIterator(
  v,
  { fAtNotObject = () => {}, fAtFunction = () => {}, fAtObject = () => {}, fAtDefault = () => {} }
) {
  const ret = [];
  const stacks = [{ container: ret, k: 0, v }];

  let stack;
  while ((stack = stacks.shift())) {
    const { container, k, v } = stack;

    switch (true) {
      // null is object
      case (!isObject(v) && !isFunction(v)) || isNull(v): {
        // Maybe it will be most of primitive type
        fAtNotObject(v, k, container);
        break;
      }
      case isFunction(v): {
        // Any function types(function, async function, generator, async generator ...)
        fAtFunction(v, k, container);
        break;
      }
      // generator iterable object can not copy
      case isPlainObject(v) || isArray(v) || isMap(v) || isSet(v): {
        // if empty return value of fAtObject function, v variable will be new container
        // if deepCopy function, new container will be return value of getNewObject function, otherwise will be v variable
        const newContainer = fAtObject(v, k, container) || v;

        forEach(v, (vv, kk) => {
          stacks.push({ container: newContainer, k: kk, v: vv });
        });
        break;
      }
      default: {
        fAtDefault(v, k, container);
        break;
      }
    }
  }
  return ret[0];
}

/**
 * Iterable object like string, Array, Map, Set, Generator iterable...
 * @private
 * @typedef {Object} Iterable
 */

/**
 * This function converts an iterable object or a plain object to new a plain object
 * @param {Iterable|Object} v an iterable object or a plain object
 * @param {function} [callback] Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be used as context(this) when executed callback function
 * @returns {Object} New plain object
 * @example
 * toPlainObject([1, 2, 3]) // {0: 1, 1: 2, 2: 3}
 */
export function toPlainObject(v, callback, context) {
  const _callback = bindToFunction(callback, context, v => v);

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
 * This function converts an iterable object or a plain object to new a map object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {function} [callback] Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be use as context(this) when executed callback function
 * @returns {Map<string, *>} New map object
 * @example
 * toMap([1, 2, 3]) // Map(3){"x" => 1, "y" => 2, "z" => 3}
 */
export function toMap(v, callback, context) {
  if (!isFunction(globalObject.Map)) {
    return null;
  }

  const _callback = bindToFunction(callback, context, v => v);

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
 * This function converts an iterable object or a plain object to new a set object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {function} [callback] Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be use as context(this) when executed callback function
 * @returns {Set<*>} New set object
 * @example
 * toSet({ x: 1, y: 2, z: 3 }) // Set(3){{ ... }, { ... }, { ... }
 */
export function toSet(v, callback, context) {
  if (!isFunction(globalObject.Set)) {
    return null;
  }

  const _callback = bindToFunction(callback, context, v => v);

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
 * This function converts an iterable object or a plain object to new an array object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {function} [callback] Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be use as context(this) when executed callback function
 * @returns {Array}
 * @example
 * toArray({ x: 1, y: 2, z: 3 }); // [{ k: 'x', v: 1 }, { k: 'y', v: 2 }, { k: 'z', v: 3 }]
 */
export { toArray };

/**
 * This function assigns several source objects to a target object
 * @param {Iterable|Object} targetObject target object which will be assigned
 * @param {Object} sourceObjects Source objects which to assign to a target object
 * @returns {Object} New target object
 * @example
 * assign([1, 2, 3], 33, 33, 44) // [ 1, 2, 3, 33, 33, 44 ]
 */
export function assign(targetObject, ...sourceObjects) {
  const t = copy(targetObject);
  const set = (target, v, k, source) => {
    switch (true) {
      case isMap(target): {
        target.set(k, v);
        break;
      }
      case isSet(target): {
        if (isMap(source) || isPlainObject(source)) {
          target.add({ k, v });
        } else {
          target.add(v);
        }
        break;
      }
      case isArrayLikeObject(target) || isIterableObject(target): {
        if (isMap(source) || isPlainObject(source)) {
          target.push({ k, v });
        } else {
          target.push(v);
        }
        break;
      }
      default: {
        target[k] = v;
        break;
      }
    }
    return v;
  };

  sourceObjects.forEach(source => {
    // if primitive value
    if (!isObject(source) || isNull(source)) {
      set(t, source, String(source), source);
    } else {
      forEach(source, (vv, k) => {
        set(t, vv, k, source);
      });
    }
  });

  return t;
}

/**
 * This function returns new array object with [key, value] pair
 * @param {Iterable|Object} v An iterable object or a plain object
 * @returns {Array} New array object
 * @example
 * entries({ x: 1, y: 2, z: new Map([['x', 1]]) }) // [['x', 1], ['y', 2], ['z', Map { 'x' => 1 }]]
 */
export function entries(v) {
  return _entries(toPlainObject(v));
}

/**
 * This function returns new value which shallow copied of given value
 * @param {*} v Value which will be copy
 * @param {*} [context] Context(this) which will be bind if function type
 * @returns {*} Copied value
 * @example
 * copy(new Map([['x', 1], ['y', 2]])) // Map { 'x' => 1, 'y' => 2 }
 */
export function copy(v, context) {
  switch (true) {
    // null is object
    case (!isObject(v) && !isFunction(v)) || isNull(v): {
      // Maybe it will be most of primitive type
      return v;
    }
    case isFunction(v): {
      // Any function types(function, async function, generator, async generator ...)
      return v.bind(context);
    }
    case isPlainObject(v): {
      return _assign({}, v);
    }
    // generator iterable object can not copy
    case isArray(v) || isMap(v) || isSet(v): {
      switch (true) {
        case isMap(v): {
          const newMap = new Map();
          forEach(v, (v, k) => newMap.set(k, v));
          return newMap;
        }
        case isSet(v): {
          const newSet = new Set();
          forEach(v, v => newSet.add(v));
          return newSet;
        }
        default:
          return toArray(v);
      }
    }
    default: {
      return {};
    }
  }
}

/**
 * This function returns new value which deep copied of given value
 * @param {*} v Value which will be copy
 * @param {function} [callback] Function which will be call on every element of given value
 * @param {*} [context] Value which will be used as context(this) when executed callback function
 * @returns {*} Copied value
 * @example
 * deepCopy({ x: { y: new Map([['x', { x: { y: function() {}, z: new Set([1, 2, 3]) } }]]) } }) // { x: { y: Map { 'x' => [Object] } } }
 */
export function deepCopy(v, callback, context) {
  const _callback = bindToFunction(callback, context, v => v);
  const set = (container, v, k) => {
    switch (true) {
      case isMap(container): {
        container.set(k, v);
        break;
      }
      case isSet(container): {
        container.add(v);
        break;
      }
      default: {
        container[k] = v;
        break;
      }
    }
    return v;
  };

  return deepIterator(v, {
    fAtNotObject: (v, k, container) => {
      set(container, _callback(v, k, container), k);
    },
    fAtFunction: (v, k, container) => {
      set(container, _callback(v.bind(container), k, container), k);
    },
    fAtObject: (v, k, container) => {
      return set(container, getNewObject(v), k);
    },
    fAtDefault: (v, k, container) => {
      set(container, {}, k);
    },
  });
}

/**
 * This function will be deeply freeze of given object
 * @param {*} v Value which will be frozen
 * @returns {*}
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
 * @param {Iterable|Object} v Iterable object or Plain object
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
 * @param {Iterable|Object} v Iterable object or Plain object
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
 * @param {Iterable|Object} v Iterable object or Plain object
 * @param {string} k key
 * @returns {boolean}
 * @example
 * hasProp({ x: { y: { z: () => {} } } }, 'x') // true
 */
export function hasProp(v, k) {
  return Object.prototype.hasOwnProperty.call(toPlainObject(v), k);
}

/**
 * This function returns whether has a property in given object
 * @param {Iterable|Object} v Iterable object or Plain object
 * @param {string} k key
 * @returns {boolean}
 * @example
 * deepHasProp({ x: { y: { z: () => {}, x: { y: { zz: 1 } } } } }, 'zz') // true
 */
export function deepHasProp(v, k) {
  const _hasProp = vv => hasProp(vv, k);

  return deepTruly(v, { fAtObject: _hasProp });
}

/**
 * This function returns whether has extensible of given object
 * @param {Iterable|Object} v Iterable object or Plain object
 * @returns {boolean}
 * @example
 * deepHasExtensible(obj)
 */
export function deepHasExtensible(v) {
  const isNotExtensible = v => !Object.isExtensible(v);

  return !deepTruly(v, { fAtObject: isNotExtensible });
}

/**
 * This function returns whether has freeze of given object
 * @param {Iterable|Object} v Iterable object or Plain object
 * @returns {boolean}
 * @example
 * deepHasFrozen(obj)
 */
export function deepHasFrozen(v) {
  const isFrozen = v => Object.isFrozen(v);

  return deepTruly(v, { fAtObject: isFrozen });
}

/**
 * This function returns whether seal of given object
 * @param {Iterable|Object} v Iterable object or Plain object
 * @returns {boolean}
 * @example
 * deepHasSealed(obj)
 */
export function deepHasSealed(v) {
  const isSealed = v => Object.isSealed(v);

  return deepTruly(v, { fAtObject: isSealed });
}

/**
 * This function returns whether included a constructor in prototype object
 * @param {Iterable|Object} v Iterable object or Plain object
 * @param {Object} constructor
 * @returns {boolean}
 * @example
 * hasInstanceOf(obj, constructor) // true
 */
export function hasInstanceOf(v, constructor) {
  return v instanceof constructor;
}

/**
 * This function inserts a value from a target index of an array object or a set object
 * @param {Array|Set} v An Array object or a Set object
 * @param {number} targetIndex Target index
 * @param {*} values Values which will be inserted
 * @returns {Set|Array}
 * @example
 * insert([1, 2, 3, 4], 1, 22) // [1, 22, 2, 3, 4]
 */
export function insert(v, targetIndex, ...values) {
  const ret = _insert(v, targetIndex, ...values);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function replaces from target index value of an array object or a set object to new values
 * @param {Array|Set} v An Array object or a Set object
 * @param {number} targetIndex Target index
 * @param {*} values Values which will be replaced
 * @returns {Set|Array}
 * @example
 * replace([1, 2, 3, 4], 2, 33, 'ADD') // [1, 2, 33, 'ADD', 4]
 */
export function replace(v, targetIndex, ...values) {
  const ret = _replace(v, targetIndex, ...values);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function inserts a value from first index of an iterable object or a plain object
 * @param {Array|Set} v An Array object or a Set object
 * @param {*} values Values which will be inserted
 * @returns {Set|Array}
 * @example
 * unshift([1, 2, 3], 11, 22, 33) // [ 11, 22, 33, 1, 2, 3 ]
 */
export function unshift(v, ...values) {
  const ret = _unshift(v, ...values);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function inserts a value from last index of an iterable object or a plain object
 * @param {Array|Set} v An Array object or a Set object
 * @param {*} values Values which will be inserted
 * @returns {Set|Array}
 * @example
 * push([1, 2, 3], 11, 22, 33) // [ 1, 2, 3, 11, 22, 33 ]
 */
export function push(v, ...values) {
  const ret = _push(v, ...values);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function inserts a value from then on before of target index of an iterable object or a plain object
 * @param {Array|Set} v An Array object or a Set object
 * @param {number} targetIndex Target index
 * @param {*} values Values which will be inserted
 * @returns {Set|Array}
 * @example
 * insertBefore([1, 2, 3], 2, 22, 33) // [ 1, 22, 33, 2, 3 ]
 */
export function insertBefore(v, targetIndex, ...values) {
  const ret = _insertBefore(v, targetIndex, ...values);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function inserts a value from then on after of target index of an iterable object or a plain object
 * @param {Array|Set} v An Array object or a Set object
 * @param {number} targetIndex Target index
 * @param {*} values Values which will be inserted
 * @returns {Set|Array}
 * @example
 * insertAfter([1, 2, 3], 1, 22, 33) // [ 1, 2, 22, 33, 3 ]
 */
export function insertAfter(v, targetIndex, ...values) {
  const ret = _insertAfter(v, targetIndex, ...values);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function removes a value at a target index of an array object or a set object
 * @param {Array|Set} v An Array object or a Set object
 * @param {number} targetIndex Target index
 * @returns {Set|Array}
 * @example
 * remove([1, 2, 3, 4], 3) // [1, 2, 3]
 */
export function remove(v, targetIndex) {
  const ret = _remove(v, targetIndex);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function removes a value from a target index of an array object or a set object
 * @param {Array|Set} v An Array object or a Set object
 * @param {number} targetIndex Target index
 * @returns {Set|Array}
 * @example
 * removeAll([1, 2, 3, 4], 1) // [1]
 */
export function removeAll(v, targetIndex) {
  const ret = _removeAll(v, targetIndex);

  if (isSet(v)) {
    return toSet(ret);
  }
  return ret;
}

/**
 * This function returns a length of an iterable object or plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @returns {number}
 * @example
 * size(new Map([['x', 1]])) // 1
 */
export function size(v) {
  return toArray(v).length;
}

/**
 * This function will be call every element of an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {function} callback Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be use as context(this) when executed callback function
 * @example
 * forEach('test', (v, k) => console.log(v)); // 't', 'e', 's', 't'
 */
export { forEach };

/**
 * This function returns new an array object which includes an every arguments
 * @param {*} values Values which will be included
 * @returns {Array}
 * @example
 * of(1, 2, 3, 4); // [1, 2, 3, 4]
 */
export { of };

/**
 * This function returns index of found value from an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {*} searchValue Search value
 * @param {number} [fromIndex=0] Start index which will be search
 * @returns {number}
 * @example
 * indexOf({ x: 1, y: 2, yy: { zz: 3 } }, 44); // -1
 */
export { indexOf };

/**
 * This function returns index of found value from an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {*} searchValue Search value
 * @param {number} [fromIndex=Iterable.length-1] Start index which will be search from last index
 * @returns {number}
 * @example
 * lastIndexOf({ x: 1, y: 2, yy: { zz: 3 } }, 44) // -1
 */
export { lastIndexOf };

/**
 * This function returns joined value as a separator from every elements of an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {*} separator separate value
 * @returns {string}
 * @example
 * join({ x: 1, y: 2, z: 3 }, '-') // '1-2-3'
 */
export { join };

/**
 * This function returns index of found value from an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @returns {Array}
 * @example
 * keys([1, , 3]) // [0, 1, 2]
 */
export { keys };

/**
 * This function returns index of found value from an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @returns {Array}
 * @example
 * values({ x: 1, y: 2, z: 3 }) // [1, 2, 3]
 */
export { values };

/**
 * This function returns a first element found from an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {function} callback Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be use as context(this) when executed callback function
 * @returns {*}
 * @example
 * find(['1', 2, 3], v => typeof v === 'number') // 2
 */
export { find };

/**
 * This function returns an index of first element found from an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {function} callback Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be use as context(this) when executed callback function
 * @returns {number}
 * @example
 * findIndex(['1', 2, 3], v => typeof v === 'number') // 1
 */
export { findIndex };

/**
 * This function returns a first element found from an iterable object or a plain object
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {function} callback Function which will be call on every element of an iterable object or a plain object
 * @param {*} [context] Value which will be use as context(this) when executed callback function
 * @returns {Object}
 * @example
 * deepFind([{ x: { xx: { y: 3, z: 'A' } } }], v => typeof v === 'number') // { c: { y: 3, z: 'A' }, k: 'y', v: 3, origin: [{ ... }] }
 */
export { deepFind };

/**
 * This function returns whether in an array includes certain value and is not
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {*} searchValue Target Value which will be search
 * @param {number} [start] Start index which to searching
 * @returns {boolean}
 * @example
 * includes([1, 2, 3], 2) // true
 */
export { includes };

/**
 * This function returns new array object sorted to ascending
 * @param {Iterable|Object} v An iterable object or a plain object
 * @returns {Array}
 * @example
 * asc({ x: 'd', y: null, z: 0xff }) // [null, 'd', 255]
 */
export { asc };

/**
 * This function returns new array object sorted to descending
 * @param {Iterable|Object} v An iterable object or a plain object
 * @returns {Array}
 * @example
 * desc(['d', true, undefined, 0xff, 'ee', [], 2e4, () => {}, 't', 0]) // [20000, 255, 'ee', 't', 'd', true, Array(0), f (), 0, undefined]
 */
export { desc };

/**
 * This function returns new array object sorted ascending by object key
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {string} key
 * @returns {Array}
 * @example
 * ascBy([{ x: 1, y: 11 }, { x: 2, y: 22 }, { x: 3, y: 33 }], 'y') // [{ ...y: 11 }, { ...y: 22 }, { ...y: 33 }]
 */
export { ascBy };

/**
 * This function returns new array object sorted descending by object key
 * @param {Iterable|Object} v An iterable object or a plain object
 * @param {string} key
 * @returns {Array}
 * @example
 * descBy([{ x: 1, y: 11 }, { x: 2, y: 22 }, { x: 3, y: 33 }], 'y') // [{ ...y: 33 }, { ...y: 22 }, { ...y: 11 }]
 */
export { descBy };

/**
 * @private
 */
export function deepTruly(v, { fAtNotObject = () => {}, fAtObject = () => {} }) {
  const stacks = [{ v }];

  let stack;
  while ((stack = stacks.shift())) {
    const { container, k, v } = stack;

    switch (true) {
      // null is object
      case (!isObject(v) && !isFunction(v)) || isNull(v): {
        // Maybe it will be most of primitive type
        if (fAtNotObject(v, k, container)) {
          return true;
        }
        break;
      }
      default: {
        if (fAtObject(v, k, container)) {
          return true;
        }

        forEach(v, (vv, kk) => {
          stacks.push({ container: v, k: kk, v: vv });
        });
        break;
      }
    }
  }
  return false;
}

// /**
//  * This function returns all property descriptors of given a object
//  * @param {Object} v object
//  * @returns {Object} plain object which included all property descriptor
//  * @example
//  * getPropDescriptors({ x: 1, y: { z: 2 } })
//  */
// export function getPropDescriptors(v) {
//   return Object.keys(v).reduce((acc, k) => {
//     acc[k] = Object.getOwnPropertyDescriptor(v, k);
//     return acc;
//   }, {});
// }

// /**
//  * This function returns new Map object which with all symbol property of an iterable object or a plain object
//  * @param {Iterable|Object} v Iterable object or Plain object
//  * @returns {Map} New Map object
//  * @example
//  * deepGetPropSymbols({ [Symbol('x2')]: 1 })
//  */
// export function deepGetPropSymbols(v) {
//   if (
//     !isFunction(globalObject.Symbol) ||
//     !isFunction(globalObject.Map) ||
//     !isFunction(Object.getOwnPropertySymbols)
//   ) {
//     return null;
//   }
//   const ret = new Map();
//   const getOwnPropertySymbols = vv => {
//     const symbols = Object.getOwnPropertySymbols(vv);
//
//     if (symbols.length) {
//       ret.set(vv, symbols);
//     }
//   };
//
//   deepIterator(v, {
//     fAtNotObject: getOwnPropertySymbols,
//     fAtFunction: getOwnPropertySymbols,
//     fAtObject: getOwnPropertySymbols,
//     fAtDefault: getOwnPropertySymbols,
//   });
//
//   return ret;
// }
