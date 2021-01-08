import {
  toPlainObject,
  toMap,
  toSet,
  toArray,
  copy,
  deepCopy,
  assign,
  entries,
  getPropDescriptors,
  deepFreeze,
  deepGetPropSymbols,
  deepSeal,
  deepPreventExtensions,
  hasProp,
  deepHasProp,
  deepHasFrozen,
  deepHasExtensible,
  deepHasSealed,
  hasInstanceOf,
  of,
} from '../lib';

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
      return { v, _this: this };
    },
    { x: 1 }
  )
);

console.log(toMap('')); // []
console.log(toMap('   ')); // ['', '']
console.log(toMap('test')); // [t, e, s, t]
console.log(toMap([1, 2, 3]));
console.log(toMap({ x: 1, y: 2, z: 3 }));
console.log(toMap({}));
console.log(toMap([]));
console.log(toMap(undefined));
console.log(toMap(null));
console.log(toMap(true));
console.log(
  toMap(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  )
);

console.log(toSet('')); // []
console.log(toSet('   ')); // ['', '']
console.log(toSet('test')); // [t, e, s, t]
console.log(toSet([1, 2, 3]));
console.log(toSet({ x: 1, y: 2, z: 3 }));
console.log(
  toSet(
    new Map([
      ['x', 11],
      ['y', 22],
      ['z', 33],
    ])
  )
);
console.log(toSet({}));
console.log(toSet([]));
console.log(toSet(undefined));
console.log(toSet(null));
console.log(toSet(true));
console.log(
  toSet(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  )
);

console.log(toArray('')); // []
console.log(toArray('   ')); // ['', '']
console.log(toArray('test')); // [t, e, s, t]
console.log(toArray([1, 2, 3]));
console.log(toArray({ x: 1, y: 2, z: 3 }));
console.log(toArray({}));
console.log(toArray([]));
console.log(toArray(undefined));
console.log(toArray(null));
console.log(toArray(true));
console.log(
  toArray(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
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

try {
  console.log(
    copy(
      new Map([
        ['x', 1],
        ['y', 2],
      ])
    )
  );
  console.log(copy(new Set([1, 2, 3])));
} catch (e) {
  console.log(e.message);
}

console.log(
  copy(
    (function*() {
      yield 1;
    })()
  )
);

console.log(deepCopy({ x: { y: { x: { y: function() {} } } } }));

console.log(assign({ x: 1, y: 2 }, { xx: 1 }, { yy: 2 }, { zz: 3 }));
console.log(entries({ x: 1, y: 2 }));
console.log(getPropDescriptors({ x: 1, y: { z: 2 } }));

try {
  const o1 = { [Symbol('x2')]: 1 };
  const m = deepGetPropSymbols(o1);
  console.log(o1);
  console.log(m.get(o1));
} catch (e) {
  console.log(e.message);
}

const freezeObject = { x: { y: { z: () => {} } } };
deepFreeze(freezeObject);

console.log(Object.isFrozen(freezeObject.x.y.z));

const sealObject = { x: { y: { z: () => {} } } };
deepSeal(sealObject);

console.log(Object.isSealed(sealObject.x.y.z));

const extensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(extensibleObject);

console.log(Object.isExtensible(extensibleObject.x.y.z));

const hasPropObject = { x: { y: { z: () => {} } } };

console.log(hasProp(hasPropObject, 'x'));

const deepHasPropObject = { x: { y: { z: () => {}, x: { y: { zz: 1 } } } } };

console.log(deepHasProp(deepHasPropObject, 'zz'));

const deepHasFrozenObject = { x: { y: { z: () => {} } } };
deepFreeze(deepHasFrozenObject.x.y.z);

console.log(deepHasFrozen(deepHasFrozenObject));

const deepHasExtensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(deepHasExtensibleObject.x.y.z);

console.log(deepHasExtensible(deepHasExtensibleObject.x.y.z));

const deepHasSealedObject = { x: { y: { z: () => {} } } };
deepSeal(deepHasSealedObject.x.y.z);

console.log(deepHasSealed(deepHasSealedObject.x.y.z));

const hasInstanceOfConstructor = function() {};

console.log(hasInstanceOf(new hasInstanceOfConstructor(), hasInstanceOfConstructor));

console.log(of(1, 2, 3));
