import { type } from 'emnida';
import { toArray } from 'array-organizer';

const { isNull, isUndefined, isFunction, isPlainObject, isArray, isMap, isSet, isObject } = type;

export function getGlobalObject() {
  try {
    return window;
  } catch (e) {
    return global;
  }
}

export function bindToFunction(v, _this, defaultV = () => {}) {
  let f = isFunction(v) ? v : defaultV;

  if (!isUndefined(_this) && !isNull(_this)) {
    f = f.bind(_this);
  }
  return f;
}

export function getNewObject(v) {
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

export function deepIterator(
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

        // array-organizer 에 이런 상황에 사용될 함수가 추가된다면, 변경될 부분이다.
        toArray(v, (vv, kk) => {
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

        toArray(v, (vv, kk) => {
          stacks.push({ container: v, k: kk, v: vv });
        });
        break;
      }
    }
  }
  return false;
}
