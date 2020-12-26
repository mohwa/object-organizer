import { type } from 'emnida';
import { toArray, reduce } from 'array-organizer';
import { _assign, _entries } from './polyfill';
import { bindToFunction, deepIterator, deepTruly, getGlobalObject } from './_utils';

const { isPlainObject, isFunction, isArray, isMap, isSet, isObject, isNull } = type;
const globalObject = getGlobalObject();

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

export function assign(v, ...args) {
  return _assign(v, ...args);
}

export function entries(v) {
  return _entries(v);
}

export function getPropDescriptors(v) {
  return Object.keys(v).reduce((acc, k) => {
    acc[k] = Object.getOwnPropertyDescriptor(v, k);
    return acc;
  }, {});
}

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
          toArray(v, (v, k) => newMap.set(k, v));
          return newMap;
        }
        case isSet(v): {
          const newSet = new Set();
          toArray(v, v => newSet.add(v));
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

export function deepFreeze(v) {
  const freeze = v => Object.freeze(v);
  deepIterator(v, { fAtFunction: freeze, fAtObject: freeze, fAtDefault: freeze });
}

export function deepSeal(v) {
  const seal = v => Object.seal(v);
  deepIterator(v, { fAtFunction: seal, fAtObject: seal, fAtDefault: seal });
}

export function deepPreventExtensions(v) {
  const prevent = v => Object.preventExtensions(v);
  deepIterator(v, { fAtFunction: prevent, fAtObject: prevent, fAtDefault: prevent });
}

export function has(v, k) {
  return Object.prototype.hasOwnProperty.call(toPlainObject(v), k);
}

export function deepHas(v, k) {
  const hasOwnProperty = (vv, kk) => {
    return k === kk && Object.prototype.hasOwnProperty.call(v, kk);
  };
  return deepTruly(v, { fAtObject: hasOwnProperty });
}

export function hasInstanceOf(v, o) {
  return v instanceof o;
}

export function deepHasInstanceOf(v, o) {
  const _hasInstanceOf = vv => {
    return hasInstanceOf(vv, o);
  };
  return deepTruly(v, { fAtObject: _hasInstanceOf });
}

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

export function deepHasExtensible(v) {
  const isExtensible = v => {
    return Object.isExtensible(v);
  };
  return deepTruly(v, { fAtObject: isExtensible });
}

export function deepHasSealed(v) {
  const isSealed = v => {
    return Object.isSealed(v);
  };
  return deepTruly(v, { fAtObject: isSealed });
}

export function deepHasFrozen(v) {
  const isFrozen = v => {
    return Object.isFrozen(v);
  };
  return deepTruly(v, { fAtObject: isFrozen });
}

export function deepHasPrototypeOf(v, p) {
  const isPrototypeOf = v => {
    return Object.prototype.isPrototypeOf.call(v, p);
  };
  return deepTruly(v, { fAtObject: isPrototypeOf });
}
