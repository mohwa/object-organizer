import { type } from 'emnida';

const { isFunction } = type;

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
