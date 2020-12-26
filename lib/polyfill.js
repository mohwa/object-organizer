import { type } from 'emnida';

const { isFunction } = type;

// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
export function _assign(...args) {
  if (isFunction(Object.assign)) {
    return Object.assign(...args);
  } else {
    const v = args[0];
    const newArgs = args.slice(1);
    // Must be writable: true, enumerable: false, configurable: true
    return (() => {
      if (v === null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      const to = Object(v);

      for (let index = 1; index < newArgs.length; index++) {
        const nextSource = newArgs[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (const nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    })();
  }
}

export function _entries(...args) {
  if (isFunction(Object.entries)) {
    return Object.entries(...args);
  } else {
    return (obj => {
      const ownProps = Object.keys(obj);
      let i = ownProps.length;
      const resArray = new Array(i);
      // preallocate the Array
      while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

      return resArray;
    })(...args);
  }
}
