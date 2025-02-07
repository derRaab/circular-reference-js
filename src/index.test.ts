import { parseCircularReferences } from "./parse";
import { stringifyCircularReferences } from "./stringify";

// Basic nested structure
const object: any = {
    "array1": [1],
    "boolean1": true,
    "number1": 1.1,
    "object1": {
        "array2": [2],
        "string2": "stringValue2",
        "object2": {
            "array3": [3],
            "string3": "stringValue3",
        }
    },
    "string1": "string1",
};


// Read nested values
const array1 = object["array1"];
const boolean1 = object["boolean1"];
const number1 = object["number1"];
const object1 = object["object1"];
const string1 = object["string1"];

const array2 = object1["array2"];
const string2 = object1["string2"];
const object2 = object1["object2"];

const array3 = object2["array3"];
const string3 = object2["string3"];


// Create circular references
const keyObject1ToArray2 = "object1 ]\"[ To Array2";
const keyObject1ToObject2 = "object1 ]\"[ To Object2";
const keyObject2ToArray3 = "object2 ]\"[ To Array3";
const keyObject2ToObject = "object2 ]\"[ To object";

array1.push(array3);
array2.push(object2);
array3.push(object);
object1[keyObject1ToArray2] = array2;
object1[keyObject1ToObject2] = object2;
object2[keyObject2ToArray3] = array3;
object2[keyObject2ToObject] = object;


// Basic tests
const assertTrue = (value: boolean) => {
    if (!value) {
        throw new Error("Assert true failed");
    }
}

const assertEqual = (a: any, b: any) => {
    if (!(a === b)) {
        throw new Error("Assert equal failed: " + a + " !== " + b);
    }
}

const assertMapHasKey = (map: Map<any,any>, key: any) => {
    if (!map.has(key)) {
        throw new Error("Assert map has key failed. " + key + " not found in map");
    }
}


const collectStrings = (parentObj: any, stringMap: Map<string,string>) => {
    if (typeof parentObj === "string") {
        stringMap.set(parentObj, parentObj);
        return;
    }

    if (typeof parentObj !== "object") {
        return;
    }

    if (Array.isArray(parentObj)) {
        for (let i = 0; i < parentObj.length; i++) {
            collectStrings(parentObj[i], stringMap);
        }
        return;
    }

    for (const key in parentObj) {
        collectStrings(parentObj[key], stringMap);
    }
}

const testObjectStructureAndValues = (testObject: any) => {
    // Read nested values
    const testArray1 = testObject["array1"];
    const testBoolean1 = testObject["boolean1"];
    const testNumber1 = testObject["number1"];
    const testObject1 = testObject["object1"];
    const testString1 = testObject["string1"];

    const testArray2 = testObject1["array2"];
    const testString2 = testObject1["string2"];
    const testObject2 = testObject1["object2"];

    const testArray3 = testObject2["array3"];
    const testString3 = testObject2["string3"];

    // Test basic values first
    assertTrue(array1[0] === testArray1[0]);
    assertEqual(boolean1, testBoolean1);
    assertEqual(number1, testNumber1);
    assertEqual(string1, testString1);
    assertEqual(string2, testString2);
    assertEqual(string3, testString3);

    // Test references
    assertTrue(testArray1[testArray1.length - 1] === testArray3);
    assertTrue(testArray2[testArray2.length - 1] === testObject2);
    assertTrue(testArray3[testArray3.length - 1] === testObject);
    assertTrue(testObject1[keyObject1ToArray2] === testArray2);
    assertTrue(testObject1[keyObject1ToObject2] === testObject2);
    assertTrue(testObject2[keyObject2ToArray3] === testArray3);
    assertTrue(testObject2[keyObject2ToObject] === testObject);
}

const testStringifiedObject = (object: any) => {
    const stringMap = new Map<string,string>();
    collectStrings(object, stringMap);

    assertMapHasKey(stringMap, ('<CircularReference path=\'\'>'));
    assertMapHasKey(stringMap, ('<CircularReference path=\'["array1"][1]\'>'));
    assertMapHasKey(stringMap, ('<CircularReference path=\'["object1"]["array2"][1]\'>'));
    assertMapHasKey(stringMap, ('<CircularReference path=\'["object1"]["array2"]\'>'));
}


console.log("Running tests...");
try {
    // Clone object 
    const objectClone = structuredClone(object);
    
    // Test object structure and values
    testObjectStructureAndValues(objectClone);

    // Stringify circular references
    stringifyCircularReferences(objectClone);

    // Stringify object
    const objectCloneString = JSON.stringify(objectClone, null, 2);
    
    // Now parse the object again
    const parsedObjectClone = JSON.parse(objectCloneString);

    // Object should contain all circular reference strings
    testStringifiedObject(parsedObjectClone);

    // Resolve circular references
    parseCircularReferences(parsedObjectClone);

    // This object should also have the exact same structure and values as the original object
    testObjectStructureAndValues(parsedObjectClone);
} catch (error) {
    console.error("❌ Test error:", error);
    process.exit(1);
}

console.log("✅ All tests passed");
process.exit(0);