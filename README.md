# circular-reference

Enables `JSON.stringify()` and `JSON.parse()` for JavaScript objects with circular references.

This library provides two methods that handle circular references by injecting or resolving a special string representation (e.g., `<CircularReference path=''>` refers to the root object):

- `stringifyCircularReferences(data:any, clone=false)` replaces all circular references with a string representation of their paths within the structure. If `clone` is `true`, the function operates on a deep copy of data, leaving the original unchanged.

- `parseCircularReferences(data:any, clone=false)` restores circular references based on the encoded paths. If `clone` is `true`, it modifies a deep copy instead of data directly.


## Install

`npm i circular-reference` or use your preferred package manager.

## How to use

### Basic example

```js
import { parseCircularReferences, stringifyCircularReferences } from "circular-reference";

// Object that references itself
const objectA = {};
      objectA.ref = objectA;

// Convert the object to a JSON string
objectA = stringifyCircularReferences(objectA);
const objectAString = JSON.stringify(objectA);
console.log(objectAString);
/* Output: {"ref":"<CircularReference path=''>"} */

// Restore the same structure from the json string
const objectB = JSON.parse(objectAString);
objectB = parseCircularReferences(objectB);
console.log(objectB.ref === objectB); // true
```
**Note:** In Node.js, circular references are displayed using `<ref *X>` notation, whereas browsers will still throw a "Converting circular structure to JSON" error if you try to directly `JSON.stringify()` an unresolved circular object.

### Complex example

```js
import { parseCircularReferences, stringifyCircularReferences } from "circular-reference";

// Two arrays and two objects
const array1 = [];
const array2 = [];
const object1 = {};
const object2 = {};
// Each object references all objects and arrays (including itself)
object1["array1"] = array1;
object1["array2"] = array2;
object1["object1"] = object1;
object1["object2"] = object2;
object2["array1"] = array1;
object2["array2"] = array2;
object2["object1"] = object1;
object2["object2"] = object2;
// Each array references all objects and arrays (including itself)
array1.push(array1);
array1.push(array2);
array1.push(object1);
array1.push(object2);
array2.push(array1);
array2.push(array2);
array2.push(object1);
array2.push(object2);

// Save the object as a json string
stringifyCircularReferences(object1);
const dataString = JSON.stringify(object1, null, 2);
console.log(dataString);
/* Output:
{
  "array1": [
    "<CircularReference path='[\"array1\"]'>",
    [
      "<CircularReference path='[\"array1\"]'>",
      "<CircularReference path='[\"array1\"][1]'>",
      "<CircularReference path=''>",
      {
        "array1": "<CircularReference path='[\"array1\"]'>",
        "array2": "<CircularReference path='[\"array1\"][1]'>",
        "object1": "<CircularReference path=''>",
        "object2": "<CircularReference path='[\"array1\"][1][3]'>"
      }
    ],
    "<CircularReference path=''>",
    "<CircularReference path='[\"array1\"][1][3]'>"
  ],
  "array2": "<CircularReference path='[\"array1\"][1]'>",
  "object1": "<CircularReference path=''>",
  "object2": "<CircularReference path='[\"array1\"][1][3]'>"
}
*/

// Parse the object again
const data = JSON.parse(dataString);
// Resolve the circular references
parseCircularReferences(data);

// Now you have a clone of the original object with the same structure and values
console.log(data);
/* Output in Node.js (browser would throw a "Converting circular structure to JSON" error): 
<ref *3> {
  array1: <ref *1> [
    [Circular *1],
    <ref *2> [
      [Circular *1],
      [Circular *2],
      [Circular *3],
      [Object]
    ],
    [Circular *3],
    <ref *4> {
      array1: [Circular *1],
      array2: [Array],
      object1: [Circular *3],
      object2: [Circular *4]
    }
  ],
  array2: <ref *2> [
    <ref *1> [
      [Circular *1],
      [Circular *2],
      [Circular *3],
      [Object]
    ],
    [Circular *2],
    [Circular *3],
    <ref *4> {
      array1: [Array],
      array2: [Circular *2],
      object1: [Circular *3],
      object2: [Circular *4]
    }
  ],
  object1: [Circular *3],
  object2: <ref *4> {
    array1: <ref *1> [
      [Circular *1],
      [Array],
      [Circular *3],
      [Circular *4]
    ],
    array2: <ref *2> [
      [Array],
      [Circular *2],
      [Circular *3],
      [Circular *4]
    ],
    object1: [Circular *3],
    object2: [Circular *4]
  }
}
```
## NPM Package Link

https://www.npmjs.com/package/circular-reference