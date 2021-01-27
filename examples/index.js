import {
  toPlainObject,
  toMap,
  toSet,
  toArray,
  copy,
  deepCopy,
  assign,
  entries,
  deepFreeze,
  deepSeal,
  deepPreventExtensions,
  hasProp,
  deepHasProp,
  deepHasFrozen,
  deepHasExtensible,
  deepHasSealed,
  hasInstanceOf,
  of,
  preInsert,
  insert,
  size,
  findIndex,
} from '../lib';

console.log(assign([1, 2, 3], 33, 33, 44)); // [ 1, 2, 3, 33, 33, 44 ]
console.log(assign(new Set([1, 2, 3]), 33, 44, 55));
console.log(assign([1, 2, 3], { x: 1 }));

console.log(preInsert([1, 2, 3, 4], 11));
console.log(insert([1, 2, 3, 4], 1, 22));
console.log(size(new Map([['x', 1]])));
console.log(preInsert({ xx: 22, yy: 33 }, 3));
console.log(preInsert(new Set([1, 2, 3, 4]), 113333));

console.log(toPlainObject('')); // {}
console.log(toPlainObject('   ')); // ['', '']
console.log(toPlainObject('test')); // [t, e, s, t]
console.log(toPlainObject([1, 2, 3])); // {0: 1, 1: 2, 2: 3}
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
console.log(toMap([1, 2, 3])); // Map(3){"x" => 1, "y" => 2, "z" => 3}
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
  // console.log(copy(new Set([1, 2, 3])));
} catch (e) {
  console.log(e.message);
}

console.log(copy(new Set([1, 2, 3]))); // Set(3) { 1, 2, 3 }

console.log(
  copy(
    (function*() {
      yield 1;
    })()
  )
);

console.log(deepCopy({ x: { y: { x: { y: function() {} } } } }));
console.log(
  deepCopy({ x: { y: new Map([['x', { x: { y: function() {}, z: new Set([1, 2, 3]) } }]]) } })
);
console.log(777, assign({ x: 1, y: 2 }, { xx: 1 }, { yy: 2 }, { zz: 3 }));
console.log(888, assign({ x: 1, y: 2 }, { xx: 1 }, new Map([['yy', 2]]), { zz: 3 }));
console.log(888, assign({ x: 1, y: 2 }, { xx: 1 }, new Set([3, 4, 5, 66]), { zz: 3 }));
console.log(
  888,
  assign({ x: 1, y: 2 }, 8888, 'test', null, new Set([3, 4, 5, 66, null, undefined]), { zz: 3 })
);
console.log(
  10,
  assign(
    [],
    function() {},
    (function*() {
      yield 6666;
    })(),
    null,
    new Set([3, 4, 5, 66, null, undefined]),
    { zz: 3 }
  )
);
console.log(
  888,
  assign(
    new Set([]),
    8888,
    'test',
    null,
    new Set([3, 4, 5, 66, null, undefined]),
    { zz: 3 },
    new Map([['zz1', 'zz1']])
  )
);
console.log(
  888,
  assign(new Map([]), 8888, 'test', null, new Set([3, 4, 5, 66, null, undefined]), { zz: 3 })
);
console.log(
  9999,
  assign(
    new Map([]),
    function() {},
    (function*() {
      yield 6666;
    })(),
    null,
    new Set([3, 4, 5, 66, null, undefined]),
    { zz: 3 }
  )
);

console.log(
  assign(
    new Set([]),
    (function*() {
      yield 6666;
    })(),
    null,
    [3, 4, 5, 6],
    new Set([3, 4, 5, 66, null, undefined]),
    { zz: 3 }
  )
);
console.log(
  assign(new Set([33, 44, 55]), 8888, 'test', null, new Set([3, 4, 5, 66, null, undefined]), {
    zz: 3,
  })
);
console.log(entries({ x: 1, y: 2, z: new Map([['x', 1]]) }));
const sealObject = { x: { y: { z: () => {} } } };
deepSeal(sealObject);

console.log(Object.isSealed(sealObject.x.y.z));

const hasPropObject = { x: { y: { z: () => {} } } };
console.log(hasProp(hasPropObject, 'x'));

const freezeObject = { x: { y: { z: () => {} } } };
deepFreeze(freezeObject);

console.log(Object.isFrozen(freezeObject.x.y.z));

const extensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(extensibleObject);

console.log(Object.isExtensible(extensibleObject.x.y.z)); // false

const deepHasPropObject = { x: { y: { z: () => {}, x: { y: { zz: 1 } } } } };
console.log(deepHasProp(deepHasPropObject, 'zz'));

const deepHasExtensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(deepHasExtensibleObject.x.y.z);

console.log(deepHasExtensible(deepHasExtensibleObject.x.y.z)); // false

const deepHasFrozenObject = { x: { y: { z: () => {} } } };
deepFreeze(deepHasFrozenObject.x.y.z);

console.log(deepHasFrozen(deepHasFrozenObject));

const deepHasSealedObject = { x: { y: { z: () => {} } } };
deepSeal(deepHasSealedObject.x.y.z);

console.log(deepHasSealed(deepHasSealedObject.x.y.z));

const hasInstanceOfConstructor = function() {};
console.log(hasInstanceOf(new hasInstanceOfConstructor(), hasInstanceOfConstructor));

console.log(of(1, 2, 3));

console.log(findIndex(['1', 2, 3], v => typeof v === 'number')); // 1
console.log(findIndex({ x: 11, y: 22, z: 33 }, ({ v }) => v === 33)); // 2
