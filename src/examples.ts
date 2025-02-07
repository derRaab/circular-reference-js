import { parseCircularReferences } from "./parse";
import { stringifyCircularReferences } from "./stringify";

// Object that references itself
const objectA: any = {};
      objectA.ref = objectA;

// Save the object as a json string
stringifyCircularReferences(objectA);
const objectAString = JSON.stringify(objectA);
console.log(objectAString); // {"ref":"<CircularReference path=''>"}

// Restore the same structure from the json string
const objectB = JSON.parse(objectAString);
parseCircularReferences(objectB);
console.log(objectB);
/* Output in Node.js (browser would throw a "Converting circular structure to JSON" error): 
<ref *1> { ref: [Circular *1] };
*/





// Two arrays and two objects
const array1: any = [];
const array2: any = [];
const object1: any = {};
const object2: any = {};
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

//console.log(object1);
// Stringify the circular references
stringifyCircularReferences(object1);

// Now you can stringify the object
const dataString = JSON.stringify(object1, null, 2);
console.log(dataString);

// Parse the object again
const data = JSON.parse(dataString);
// Resolve the circular references
parseCircularReferences(data);

// Now you have a clone of the original object with the same structure and values
console.log(data);