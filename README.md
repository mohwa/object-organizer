# object-organizer

This library is will be used to handling data of object type

[API Documentation](http://mohwa.github.io/object-organizer)
 
 # Install
 
 ```javascript
 npm i object-organizer
 ```
 
 # Support Platforms
 
 IE9 later, All modern browsers(Chrome, Safari, Edge ...), NodeJS(`10.0.0` version later).
 
 ## API Examples
 
 ```javascript
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
} from 'object-organizer';
 
console.log(toPlainObject('')); // {}
console.log(toPlainObject('   ')); // { 0: " ", 1: " ", 2: " "}
console.log(toPlainObject('test')); // { 0: "t", 1: "e", 2: "s", 3: "t"}
console.log(toPlainObject([1, 2, 3])); // { 0: 1, 1: 2, 2: 3}
console.log(toPlainObject({ x: 1, y: 2, z: 3 })); // { x: 1, y: 2, z: 3}
console.log(toPlainObject({})); // {}
console.log(toPlainObject([])); // {}
console.log(toPlainObject(undefined)); // {}
console.log(toPlainObject(null)); // {}
console.log(toPlainObject(true)); // {}
console.log(
  toPlainObject(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  )
); // { 0: { ... }, 1: { ... }, 2: { ... } }

console.log(toMap('')); // Map(0) {}
console.log(toMap('   ')); // Map(3) { 0 => " ", 1 => " ", 2 => " "}
console.log(toMap('test')); // Map(4) { 0 => "t", 1 => "e", 2 => "s", 3 => "t"}
console.log(toMap([1, 2, 3])); // Map(3) { 0 => 1, 1 => 2, 2 => 3}
console.log(toMap({ x: 1, y: 2, z: 3 })); // Map(3) { "x" => 1, "y" => 2, "z" => 3}
console.log(toMap({})); // Map(0) {}
console.log(toMap([])); // Map(0) {}
console.log(toMap(undefined)); // Map(0) {}
console.log(toMap(null)); // Map(0) {}
console.log(toMap(true)); // Map(0) {}
console.log(
  toMap(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  )
); // Map(3) { 0 => { ... }, 1 => { ... }, 2 => { ... }}

console.log(toSet('')); // Set(0) {}
console.log(toSet('   ')); // Set(3) {"t", "e", "s"}
console.log(toSet('test')); // Set(3) {"t", "e", "s"}
console.log(toSet([1, 2, 3])); // Set(3) {1, 2, 3}
console.log(toSet({ x: 1, y: 2, z: 3 })); // Set(3) {{ k: 'x', v: 1 }, { ... }, { ... }}
console.log(toSet({})); // Set(0) {}
console.log(toSet([])); // Set(0) {}
console.log(toSet(undefined)); // Set(0) {}
console.log(toSet(null)); // Set(0) {}
console.log(toSet(true)); // Set(0) {}
console.log(
  toSet(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  )
); // Set(3) {{ ... }, { ... }, { ... }}


console.log(toArray('')); // []
console.log(toArray('   ')); // ['', '', '']
console.log(toArray('test')); // ['t', 'e', 's', 't']
console.log(toArray([1, 2, 3])); // [1, 2, 3]
console.log(toArray({ x: 1, y: 2, z: 3 })); // [{ k: 'x', v: 1 }, { ... }, { ... }]
console.log(toArray({})); // []
console.log(toArray([])); // []
console.log(toArray(undefined)); // []
console.log(toArray(null)); // []
console.log(toArray(true)); // []
console.log(
  toArray(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  )
); // [{ ... }, { ... }, { ... }]

console.log(copy(1)); // 1
console.log(copy(undefined)); // undefined
console.log(copy(null)); // null
console.log(copy(function() {})); // ƒ () {}
console.log(copy([11, 22, 33])); // [11, 22, 33]
console.log(copy({ x: 1, y: 2 })); // { x: 1, y: 2 }
console.log(
  copy(
    new Map([
      ['x', 1],
      ['y', 2],
    ])
  )
); // Map(2) {"x" => 1, "y" => 2}
console.log(copy(new Set([1, 2, 3]))); // Set(3) { 1, 2, 3 } 
console.log(
  copy(
    (function*() {
      yield 1;
    })()
  )
); // {}

console.log(deepCopy({ x: { y: { x: { y: function() {} } } } })); // { x: { y: { ... } } } 

console.log(assign({ x: 1, y: 2, z: new Map([['x', 1]]) }, { xx: 1 }, { yy: 2 }, { zz: 3 })); // { x: 1, y: 2, xx: 1, yy: 2, zz: 3}
console.log(entries({ x: 1, y: 2, z: new Map([['x', 1]]) })); // [Array(2), Array(2)]
console.log(getPropDescriptors({ x: 1, y: { z: 2 } })); // { x: { ... }, y: { ... }}

const o1 = { [Symbol('x2')]: 1 };
const m = deepGetPropSymbols(o1);

console.log(m.get(o1)); // [Symbol(x2)]

const freezeObject = { x: { y: { z: () => {} } } };
deepFreeze(freezeObject);

console.log(Object.isFrozen(freezeObject.x.y.z)); // true

const sealObject = { x: { y: { z: () => {} } } };
deepSeal(sealObject);

console.log(Object.isSealed(sealObject.x.y.z)); // true

const extensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(extensibleObject);

console.log(Object.isExtensible(extensibleObject.x.y.z)); // false

const hasPropObject = { x: { y: { z: () => {} } } };

console.log(hasProp(hasPropObject, 'x')); // true

const deepHasPropObject = { x: { y: { z: () => {}, x: { y: { zz: 1 } } } } };

console.log(deepHasProp(deepHasPropObject, 'zz')); // true

const deepHasFrozenObject = { x: { y: { z: () => {} } } };
deepFreeze(deepHasFrozenObject.x.y.z);

console.log(deepHasFrozen(deepHasFrozenObject)); // true

const deepHasExtensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(deepHasExtensibleObject.x.y.z);

console.log(deepHasExtensible(deepHasExtensibleObject.x.y.z)); // false

const deepHasSealedObject = { x: { y: { z: () => {} } } };
deepSeal(deepHasSealedObject.x.y.z);

console.log(deepHasSealed(deepHasSealedObject.x.y.z)); // true

const hasInstanceOfConstructor = function() {};

console.log(hasInstanceOf(new hasInstanceOfConstructor(), hasInstanceOfConstructor)); // true

console.log(of(1, 2, 3)); // { 0: 1, 1: 2, 2: 3 }
 ```
