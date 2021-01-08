# object-organizer

![npm](https://img.shields.io/npm/v/object-organizer) [![](https://data.jsdelivr.com/v1/package/npm/object-organizer/badge)](https://www.jsdelivr.com/package/npm/object-organizer) ![NPM](https://img.shields.io/npm/l/object-organizer)

This library is will be used to handling data of object type

[API Documentation](http://mohwa.github.io/object-organizer)
 
 # Install
 
 ```javascript
 npm i object-organizer
 ```
 
 # Support Platforms
 
 IE9 later, All modern browsers(Chrome, Safari, Edge ...), NodeJS(`10.0.0` version later).
 
 ## Conversion API
 
 ```javascript
import {
  toPlainObject,
  toMap,
  toSet,
  toArray,
} from 'object-organizer';
 
toPlainObject(''); // {}
toPlainObject('   '); // { 0: " ", 1: " ", 2: " "}
toPlainObject('test'); // { 0: "t", 1: "e", 2: "s", 3: "t"}
toPlainObject([1, 2, 3]); // { 0: 1, 1: 2, 2: 3}
toPlainObject({ x: 1, y: 2, z: 3 }); // { x: 1, y: 2, z: 3}
toPlainObject({}); // {}
toPlainObject([]); // {}
toPlainObject(undefined); // {}
toPlainObject(null); // {}
toPlainObject(true); // {}

  toPlainObject(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  ); // { 0: { ... }, 1: { ... }, 2: { ... } }

toMap(''); // Map(0) {}
toMap('   '); // Map(3) { 0 => " ", 1 => " ", 2 => " "}
toMap('test'); // Map(4) { 0 => "t", 1 => "e", 2 => "s", 3 => "t"}
toMap([1, 2, 3]); // Map(3) { 0 => 1, 1 => 2, 2 => 3}
toMap({ x: 1, y: 2, z: 3 }); // Map(3) { "x" => 1, "y" => 2, "z" => 3}
toMap({}); // Map(0) {}
toMap([]); // Map(0) {}
toMap(undefined); // Map(0) {}
toMap(null); // Map(0) {}
toMap(true); // Map(0) {}

  toMap(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  ); // Map(3) { 0 => { ... }, 1 => { ... }, 2 => { ... }}

toSet(''); // Set(0) {}
toSet('   '); // Set(3) {"t", "e", "s"}
toSet('test'); // Set(3) {"t", "e", "s"}
toSet([1, 2, 3]); // Set(3) {1, 2, 3}
toSet({ x: 1, y: 2, z: 3 }); // Set(3) {{ k: 'x', v: 1 }, { ... }, { ... }}
toSet({}); // Set(0) {}
toSet([]); // Set(0) {}
toSet(undefined); // Set(0) {}
toSet(null); // Set(0) {}
toSet(true); // Set(0) {}

  toSet(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  ); // Set(3) {{ ... }, { ... }, { ... }}


toArray(''); // []
toArray('   '); // ['', '', '']
toArray('test'); // ['t', 'e', 's', 't']
toArray([1, 2, 3]); // [1, 2, 3]
toArray({ x: 1, y: 2, z: 3 }); // [{ k: 'x', v: 1 }, { ... }, { ... }]
toArray({}); // []
toArray([]); // []
toArray(undefined); // []
toArray(null); // []
toArray(true); // []

  toArray(
    [1, 2, 3],
    function(v) {
      return { v, _this: this };
    },
    { x: 1 }
  ); // [{ ... }, { ... }, { ... }]
 ```

## Copy API
 
 ```javascript
import {
  copy,
  deepCopy,
} from 'object-organizer';
 
copy(1); // 1
copy(undefined); // undefined
copy(null); // null
copy(function() {}); // ƒ () {}
copy([11, 22, 33]); // [11, 22, 33]
copy({ x: 1, y: 2 }); // { x: 1, y: 2 }

copy(
new Map([
  ['x', 1],
  ['y', 2],
])
); // Map(2) {"x" => 1, "y" => 2}

copy(new Set([1, 2, 3])); // Set(3) { 1, 2, 3 } 

copy(
(function*() {
  yield 1;
})()
); // {}

deepCopy({ x: { y: { x: { y: function() {} } } } }); // { x: { y: { ... } } }

deepCopy({ x: { y: new Map([['x', { x: { y: function() {}, z: new Set([1, 2, 3]) } }]]) } }); // { x: { y: { ... } } } 
 ```

## Other API

```javascript
import {
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
 
assign({ x: 1, y: 2, z: new Map([['x', 1]]) }, { xx: 1 }, { yy: 2 }, { zz: 3 }); // { x: 1, y: 2, xx: 1, yy: 2, zz: 3}
entries({ x: 1, y: 2, z: new Map([['x', 1]]) }); // [Array(2), Array(2)]
getPropDescriptors({ x: 1, y: { z: 2 } }); // { x: { ... }, y: { ... }}

const o1 = { [Symbol('x2')]: 1 };
const m = deepGetPropSymbols(o1);

m.get(o1); // [Symbol(x2)]

const freezeObject = { x: { y: { z: () => {} } } };
deepFreeze(freezeObject);

Object.isFrozen(freezeObject.x.y.z); // true

const sealObject = { x: { y: { z: () => {} } } };
deepSeal(sealObject);

Object.isSealed(sealObject.x.y.z); // true

const extensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(extensibleObject);

Object.isExtensible(extensibleObject.x.y.z); // false

const hasPropObject = { x: { y: { z: () => {} } } };

hasProp(hasPropObject, 'x'); // true

const deepHasPropObject = { x: { y: { z: () => {}, x: { y: { zz: 1 } } } } };

deepHasProp(deepHasPropObject, 'zz'); // true

const deepHasFrozenObject = { x: { y: { z: () => {} } } };
deepFreeze(deepHasFrozenObject.x.y.z);

deepHasFrozen(deepHasFrozenObject); // true

const deepHasExtensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(deepHasExtensibleObject.x.y.z);

deepHasExtensible(deepHasExtensibleObject.x.y.z); // false

const deepHasSealedObject = { x: { y: { z: () => {} } } };
deepSeal(deepHasSealedObject.x.y.z);

deepHasSealed(deepHasSealedObject.x.y.z); // true

const hasInstanceOfConstructor = function() {};

hasInstanceOf(new hasInstanceOfConstructor(), hasInstanceOfConstructor); // true

of(1, 2, 3); // { 0: 1, 1: 2, 2: 3 }
 ```
