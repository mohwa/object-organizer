# object-organizer

![npm](https://img.shields.io/npm/v/object-organizer) [![](https://data.jsdelivr.com/v1/package/npm/object-organizer/badge)](https://www.jsdelivr.com/package/npm/object-organizer) ![NPM](https://img.shields.io/npm/l/object-organizer)

# Concept

- You will be able to use an iterable object of all type or a plain object on almost all API of this library

> ex: Array, Plain object, Map, Set, Generator Iterable object ...
                                                                                      
- The library included essential apis necessary when development an application

> I think not need big library like the [lodash](https://lodash.com/) or [underscore](https://underscorejs.org/) when development most an application

- Supports [tree shaking](https://webpack.js.org/guides/tree-shaking/) for the application size of your project
 
- Supports multiple browsers

> You will able to use [array-organizer](https://www.npmjs.com/package/array-organizer) when for handling as only data of an array type 
 
 # Install
 
 ```javascript
 npm i object-organizer
 ```

# API Documentation

http://mohwa.github.io/object-organizer
 
 # Support Platforms
  
 IE9 later, All modern browsers(Chrome, Safari, Edge ...), NodeJS(`10.0.0` version later)
 
 ## Conversion API
 
 That apis will be convert given an iterable object or a plain object to certain an object
 
 ```javascript
import {
  toPlainObject,
  toMap,
  toSet,
  toArray,
} from 'object-organizer';
 
toPlainObject(''); // {}
toPlainObject('   '); // { '0': ' ', '1': ' ', '2': ' ' }
toPlainObject('test'); // { '0': 't', '1': 'e', '2': 's', '3': 't' }
toPlainObject([1, 2, 3]); // { '0': 1, '1': 2, '2': 3 }
toPlainObject({ x: 1, y: 2, z: 3 }); // { x: 1, y: 2, z: 3 }
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
); // { '0': { v: 1, _this: { x: 1 } },'1': { v: 2, _this: { x: 1 } },'2': { v: 3, _this: { x: 1 } }}

Map { 0 => 1, 1 => 2, 2 => 3 }
Map { 'x' => 1, 'y' => 2, 'z' => 3 }
Map {}
Map {}
Map {}
Map {}
Map {}
Map {
  0 => { v: 1, _this: { x: 1 } },
  1 => { v: 2, _this: { x: 1 } },
  2 => { v: 3, _this: { x: 1 } }
}


toMap(''); // Map {}
toMap('   '); // Map { 0 => ' ', 1 => ' ', 2 => ' ' }
toMap('test'); // Map { 0 => 't', 1 => 'e', 2 => 's', 3 => 't' }
toMap([1, 2, 3]); // Map { 0 => 1, 1 => 2, 2 => 3 }
toMap({ x: 1, y: 2, z: 3 }); // Map { 'x' => 1, 'y' => 2, 'z' => 3 }
toMap({}); // Map {}
toMap([]); // Map {}
toMap(undefined); //Map {}
toMap(null); // Map {}
toMap(true); // Map {}

toMap(
  [1, 2, 3],
  function(v) {
    return { v, _this: this };
  },
  { x: 1 }
); // Map { 0 => { v: 1, _this: { x: 1 } }, 1 => { v: 2, _this: { x: 1 } }, 2 => { v: 3, _this: { x: 1 } }}

toSet(''); // Set {}
toSet('   '); // Set { ' ' }
toSet('test'); // Set { 't', 'e', 's' }
toSet([1, 2, 3]); // Set { 1, 2, 3 }
toSet({ x: 1, y: 2, z: 3 }); // Set { { k: 'x', v: 1 }, { k: 'y', v: 2 }, { k: 'z', v: 3 } }
toSet({}); // Set {}
toSet([]); // Set {}
toSet(undefined); // Set {}
toSet(null); // Set {}
toSet(true); // Set {}

toSet(
  [1, 2, 3],
  function(v) {
    return { v, _this: this };
  },
  { x: 1 }
); // Set {{ v: 1, _this: { x: 1 } },{ v: 2, _this: { x: 1 } },{ v: 3, _this: { x: 1 } }}

toArray(''); // []
toArray('   '); // [ ' ', ' ', ' ' ]
toArray('test'); // [ 't', 'e', 's', 't' ]
toArray([1, 2, 3]); // [ 1, 2, 3 ]
toArray({ x: 1, y: 2, z: 3 }); // [ { k: 'x', v: 1 }, { k: 'y', v: 2 }, { k: 'z', v: 3 } ]
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
); // [{ v: 1, _this: { x: 1 } },{ v: 2, _this: { x: 1 } },{ v: 3, _this: { x: 1 } }]
 ```

## Copy API

That apis will be used copy or deep-copy an iterable object or a plain object
 
 ```javascript
import {
  copy,
  deepCopy,
} from 'object-organizer';
 
1
undefined
null
[Function: bound ]
[ 11, 22, 33 ]
{ x: 1, y: 2 }
Map { 'x' => 1, 'y' => 2 }
{}

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
); // Map { 'x' => 1, 'y' => 2 }

copy(new Set([1, 2, 3])); // Set { 1, 2, 3 } 

copy(
  (function*() {
    yield 1;
  })()
); // {}

deepCopy({ x: { y: { x: { y: function() {} } } } }); // { x: { y: { x: [Object] } } }
deepCopy({ x: { y: new Map([['x', { x: { y: function() {}, z: new Set([1, 2, 3]) } }]]) } }); // { x: { y: Map { 'x' => [Object] } } } 
 ```

## Main API 

You will be able to use for add or remove or search every element of iterable object via various apis 
 
```javascript
import {
  assign,
  find,
  asc,
  desc,
  preInsert,
  insert,
  replace,
  remove,
  removeAll,
  includes,
  deepFind,
  ascBy,
  descBy,
  forEach,
  indexOf,
  lastIndexOf,
  keys,
  values,
  join,
  size,
  hasProp,
  hasInstanceOf
} from 'object-organizer';

assign([1, 2, 3], 33, 33, 44); // [ 1, 2, 3, 33, 33, 44 ]
assign(new Set([1, 2, 3]), 33, 44, 55); // Set { 1, 2, 3, 33, 44, 55 }
assign([1, 2, 3], { x: 1 }); // [ 1, 2, 3, { k: 'x', v: 1 } ]

find(['1', 2, 3], v => typeof v === 'number'); // 2
find({ x: 11, y: 22, z: 33 }, ({ v }) => typeof v === 'number'); // { k: 'x', v: 11 }

forEach('  ', (v, k) => console.log(v)); // '', ''
forEach('test', (v, k) => console.log(v)); // 't', 'e', 's', 't'
forEach([1, 2, 3], (v, k) => console.log(v)); // 1, 2, 3
forEach({ x: 1, y: 2, z: 3 }, (v) => console.log(v)); // 1, 2, 3
forEach(new Map([['x', 1], ['y', 2], ['z', 3]]), (v) => console.log(v)); // 1, 2, 3
forEach(new Set([1, 2, 3]), (v) => console.log(v)); // 1, 2, 3

indexOf([1, 2, 3], 2); // 1
indexOf({ x: 1, y: 2, yy: { zz: 3 } }, 44); // -1

lastIndexOf([1, 2, 3], 2); // 1
lastIndexOf({ x: 1, y: 2, yy: { zz: 3 } }, 44); // -1

join([1, 2, 3], '-') // '1-2-3'
join({ x: 1, y: 2, z: 3 }, '-') // '1-2-3'

keys([1, , 3]); // [0, 1, 2]
keys({ x: 1, y: 2, z: 3 }); // ['x', 'y', 'z']

values([1, , 3]); // [1, undefined, 3]
values({ x: 1, y: 2, z: 3 }); // [1, 2, 3]

// In result c is container object of y property
deepFind([{ x: { xx: { y: 3, z: 'A' } } }], v => typeof v === 'number'); // { c: { y: 3, z: 'A' }, k: 'y', v: 3, origin: [{ ... }] }

// Will be found a 2 from an array object 
includes([1, 2, 3], 2); // true
includes({ x: 1, y: 2, yy: { zz: 3 } }, 44); // false

asc(['d', null, 0xff, true, { x: 1 }, 'ee', new Map(), 't', 0]); // [null, { x: 1 }, {}, 0, true, 'd', 't', 'ee', 255]
asc({ x: 'd', y: null, z: 0xff }); // [null, 'd', 255]

desc([5, 3, 4, 6, 1, 2]); // [6, 5, 4, 3, 2, 1]
// Will be sorted after convert 0xff to number 255
desc(['d', true, undefined, 0xff, 'ee', [], 2e4, () => {}, 't', 0]); // [20000, 255, 'ee', 't', 'd', true, Array(0), f (), 0, undefined]

// Will be ascending based y property
ascBy([{ x: 1, y: 11 }, { x: 2, y: 22 }, { x: 3, y: 33 }], 'y'); // [{ ...y: 11 }, { ...y: 22 }, { ...y: 33 }]
descBy([{ x: 1, y: 11 }, { x: 2, y: 22 }, { x: 3, y: 33 }], 'y'); // [{ ...y: 33 }, { ...y: 22 }, { ...y: 11 }]
 
preInsert([1, 2, 3, 4], 11); // [11, 22, 2, 3, 4]
preInsert({ xx: 22, yy: 33 }, 3); // [3, { k: 'xx', v: 22 }, { k: 'yy', v: 33 }]

// Will be inserted a 22 to index 1
insert([1, 2, 3, 4], 1, 22); // [1, 22, 2, 3, 4]
// Will be inserted a 22 to index 1 and add 'ADD'
replace([1, 2, 3, 4], 2, 33, 'ADD'); // [1, 2, 33, 'ADD', 4]

remove([1, 2, 3, 4], 3); // [1, 2, 3]
removeAll([1, 2, 3, 4], 1); // [1]

size(new Map([['x', 1]])) // 1

hasProp({ x: { y: { z: () => {} } } }, 'x') // true

const hasInstanceOfConstructor = function() {};

hasInstanceOf(new hasInstanceOfConstructor(), hasInstanceOfConstructor); // true
``` 

# Deep dive API

That apis will be used a deep based a native functions

```javascript
import {
  deepFreeze,
  deepSeal,
  deepPreventExtensions,
  deepHasProp,
  deepHasExtensible,
  deepHasFrozen,
  deepHasSealed
} from 'object-organizer';

const freezeObject = { x: { y: { z: () => {} } } };
deepFreeze(freezeObject);

console.log(Object.isFrozen(freezeObject.x.y.z)); // true

const sealObject = { x: { y: { z: () => {} } } };
deepSeal(sealObject);

console.log(Object.isSealed(sealObject.x.y.z)); // true

const extensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(extensibleObject);

console.log(Object.isExtensible(extensibleObject.x.y.z)); // false

const deepHasPropObject = { x: { y: { z: () => {}, x: { y: { zz: 1 } } } } };
console.log(deepHasProp(deepHasPropObject, 'zz')); // true

const deepHasExtensibleObject = { x: { y: { z: () => {} } } };
deepPreventExtensions(deepHasExtensibleObject.x.y.z); // true

console.log(deepHasExtensible(deepHasExtensibleObject.x.y.z)); // false

const deepHasFrozenObject = { x: { y: { z: () => {} } } };
deepFreeze(deepHasFrozenObject.x.y.z); // true

console.log(deepHasFrozen(deepHasFrozenObject));

const deepHasSealedObject = { x: { y: { z: () => {} } } };
deepSeal(deepHasSealedObject.x.y.z); // true

console.log(deepHasSealed(deepHasSealedObject.x.y.z)); // true
```

## Other API

```javascript
import {
  entries,
  of
} from 'object-organizer';
 
entries({ x: 1, y: 2, z: new Map([['x', 1]]) }); // [ [ 'x', 1 ], [ 'y', 2 ], [ 'z', Map { 'x' => 1 } ] ]

of(1, 2, 3) // [ 1, 2, 3 ]
 ```
