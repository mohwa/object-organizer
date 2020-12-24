import { type } from 'emnida';
import { toArray, reduce } from 'array-organizer';
import { _assign, _entries, _getOwnPropertyDescriptors } from './polyfill';
import { bindToFunction, getNewObject } from './_utils';

const { isPlainObject, isFunction, isArray, isMap, isSet, isObject, isNull } = type;

export function toObject(v, f, _this) {
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

// assign 은 객체를 copy 하는 함수이다
// 그래서 deepCopy 는 object-organizer 에 있어야할듯하댜.
export function assign(v, ...args) {
  return _assign(toObject(v), ...args);
}

export function create(v, ...args) {
  return Object.create(toObject(v), ...args);
}

export function defineProps(v, ...args) {
  return Object.defineProperties(toObject(v), ...args);
}

export function entries(v) {
  return _entries(toObject(v));
}

export function freeze(v) {
  return Object.freeze(toObject(v));
}

export function getPropDescriptor(v, k) {
  return Object.getOwnPropertyDescriptor(toObject(v), k);
}

export function getPropDescriptors(v) {
  return _getOwnPropertyDescriptors(toObject(v));
}

export function getPropSymbols(v) {
  if (isFunction(Object.getOwnPropertySymbols)) {
    return Object.getOwnPropertySymbols(toObject(v));
  }
  return [];
}

export function getPrototypeOf(v) {
  return Object.getPrototypeOf(toObject(v));
}

export function hasProp(v, k) {
  return toObject(v).hasOwnProperty(k);
}

export function seal(v) {
  return Object.seal(toObject(v));
}

// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf#Appending_Prototype_Chains
// 이 구현을 확인해야한다.
export function setPrototypeOf(v, p) {
  return Object.setPrototypeOf(v, p);
}

export function keys(v) {
  return Object.keys(toObject(v));
}

export function values(v) {
  return Object.values(toObject(v));
}

export function preventExtensions(v) {
  return Object.preventExtensions(toObject(v));
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

export function copyDeep(v, f, _this) {
  const _f = bindToFunction(f, _this, v => v);
  const ret = [];
  const stacks = [{ container: ret, k: 0, v }];
  const set = (c, k, v) => {
    if (isMap(c)) {
      return c.set(k, v);
    }
    if (isSet(c)) {
      return c.add(v);
    }
    c[k] = v;
  };

  let stack;
  while ((stack = stacks.shift())) {
    const { container, k, v } = stack;

    switch (true) {
      // null is object
      case !isObject(v) || isNull(v): {
        // Maybe it will be most of primitive type
        set(container, k, _f(v, k, container));
        break;
      }
      case isFunction(v): {
        // Any function types(function, async function, generator, async generator ...)
        set(container, k, _f(v.bind(container), k, container));
        break;
      }
      case isPlainObject(v) || isArray(v) || isMap(v) || isSet(v): {
        const newObject = getNewObject(v);

        set(container, k, newObject);
        toArray(v, (vv, kk) => {
          stacks.push({ container: newObject, k: kk, v: vv });
        });
        break;
      }
      default: {
        set(container, k, {});
        break;
      }
    }
  }
  return ret[0];
}

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
