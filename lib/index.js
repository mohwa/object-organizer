import { type } from 'emnida';
import { toArray, reduce } from 'array-organizer';
import { _assign, _entries, _getOwnPropertyDescriptors } from './polyfill';
import { bindToFunction, deepIterator } from './_utils';

const { isPlainObject, isFunction, isArray, isMap, isSet, isObject, isNull } = type;

export function toPlainObject(v, f, _this) {
  const _f = bindToFunction(f, _this, function(v) {
    return v;
  });

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
  return _getOwnPropertyDescriptors(v);
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

// export function create(v, ...args) {
//   return Object.create(toObject(v), ...args);
// }

// export function defineProps(v, ...args) {
//   return Object.defineProperties(toObject(v), ...args);
// }

// export function getPropDescriptor(v, k) {
//   return Object.getOwnPropertyDescriptor(toObject(v), k);
// }

// export function getPropSymbols(v) {
//   if (isFunction(Object.getOwnPropertySymbols)) {
//     return Object.getOwnPropertySymbols(toObject(v));
//   }
//   return [];
// }
//
// export function getPrototypeOf(v) {
//   return Object.getPrototypeOf(toObject(v));
// }
//
// export function hasProp(v, k) {
//   return toObject(v).hasOwnProperty(k);
// }
//
// export function seal(v) {
//   return Object.seal(toObject(v));
// }

// // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf#Appending_Prototype_Chains
// // 이 구현을 확인해야한다.
// export function setPrototypeOf(v, p) {
//   return Object.setPrototypeOf(v, p);
// }

// export function keys(v) {
//   return Object.keys(toObject(v));
// }
//
// export function values(v) {
//   return Object.values(toObject(v));
// }
//
// export function preventExtensions(v) {
//   return Object.preventExtensions(toObject(v));
// }

// export function is(...args) {
//   return _is(...args);
// }
//
// export function isExtensible(v) {
//   if (isPrimitive(v)) {
//     return false;
//   }
//   return Object.isExtensible(v);
// }
//
// export function isFrozen(v) {
//   if (isPrimitive(v)) {
//     return true;
//   }
//   return Object.isFrozen(v);
// }
//
// export function isPrototypeOf(t, v) {
//   return toObject(t).isPrototypeOf(v);
// }
