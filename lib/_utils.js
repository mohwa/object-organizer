import { type } from 'emnida';

const {
  isNull,
  isUndefined,
  isIterableObject,
  isFunction,
  isString,
  isPlainObject,
  isArray,
  isMap,
  isSet,
} = type;
//
// export function getGlobalObject() {
//   try {
//     return window;
//   } catch (e) {
//     return global;
//   }
// }
//
// export function isGenerator(v) {
//   return v?.constructor === function*() {}.constructor;
// }
//
// export function isAsyncGenerator(v) {
//   return v?.constructor === async function*() {}.constructor;
// }

export function isIterableObjectWithoutString(v) {
  return !isString(v) && isIterableObject(v);
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
      return v;
    }
  }
}

// export function deepQuery(v, f = () => {}) {
//   const stacks = [{ v }];
//
//   let stack;
//   while ((stack = stacks.shift())) {
//     const { container, k, v } = stack;
//
//     switch (true) {
//       case isObject(v): {
//         toArray(v, (vv, kk) => {
//           stacks.push({ container: v, k: kk, v: vv });
//         });
//         break;
//       }
//       default: {
//         if (f(v, k, container)) {
//           return { v, k, c: container };
//         }
//         break;
//       }
//     }
//   }
// }

// const iterable = {
//   [Symbol.iterator]() {
//     return {
//       data: [1, 2, 3, 4, 5],
//       next() {
//         return { done: this.data.length === 0, value: this.data.shift() }; //
//       },
//     };
//   },
// };
//
// const iterableProto = {
//   __proto__: {
//     [Symbol.iterator]() {
//       return {
//         data: [1, 2, 3, 4, 5],
//         next() {
//           return { done: this.data.length === 0, value: this.data.shift() }; //
//         },
//       };
//     },
//   },
// };

//
// export function toNumber(v) {
//   const nv = Number(v);
//
//   if (isFinite(nv)) {
//     return nv;
//   }
//
//   if (isString(v)) {
//     const arr = _from(v);
//     let ret = 0;
//
//     arr.forEach(vv => {
//       ret += vv.charCodeAt(0);
//     });
//
//     return ret;
//   }
//   return 0;
// }
