// import { type } from 'emnida';
import { toPlainObject, copy, deepCopy, deepSeal } from '../lib';

console.log(toPlainObject('')); // []
console.log(toPlainObject('   ')); // ['', '']
console.log(toPlainObject('test')); // [t, e, s, t]
console.log(toPlainObject([1, 2, 3]));
console.log(toPlainObject({ x: 1, y: 2, z: 3 }));
console.log(toPlainObject({}));
console.log(toPlainObject([]));
console.log(toPlainObject(undefined));
console.log(toPlainObject(null));
console.log(toPlainObject(true));
console.log(
  toPlainObject(
    [1, 2, 3],
    function(v) {
      return { v, vv: this };
    },
    { x: 1 }
  )
);

console.log(copy(1));
console.log(copy(undefined));
console.log(copy(null));
console.log(copy(function() {}));
console.log(copy([11, 22, 33]));
console.log(copy({ x: 1, y: 2 }));
console.log(
  copy(
    new Map([
      ['x', 1],
      ['y', 2],
    ])
  )
);
console.log(copy(new Set([1, 2, 3])));
console.log(
  copy(
    (function*() {
      yield 11;
    })()
  )
);

const _xxx = new Map();
_xxx.set('x', 1);
_xxx.set('y', 2);
_xxx.set('z', { xxx: 1 });

const _yyy = new Set();
_yyy.add(11);
_yyy.add(22);
_yyy.add(33);
_yyy.add({ x: 11 });

console.log(44444, _yyy.entries());

const iter1 = (function* gen1() {
  yield 2;
})();

const z1 = [
  {
    x: { xx: { _xxx, _yyy } },
    y: 2,
    z: {
      newMap: new Map([
        ['xxx', 111],
        ['yyy', { zzz: 1 }],
      ]),
      iter1,
    },
  },
];
// const gen1 = function* gen1() {
//   yield 1;
// };

const _null = deepCopy(null);
console.log(_null);

const xx2 = deepCopy(z1);

console.log(xx2);
console.log(_xxx, xx2[0].x.xx._xxx);
console.log(_xxx === xx2[0].x.xx._xxx);

console.log(_yyy, xx2[0].x.xx._yyy);
console.log(_yyy === xx2[0].x.xx._yyy);

console.log(iter1, xx2[0].z.iter1);
console.log(iter1 === xx2[0].z.iter1);

const o = { x: 1, y: { z: { xx: new Map([['x', 1]]) } } };
const df = deepSeal(o);

console.log(df);
console.log(Object.isSealed(o));
