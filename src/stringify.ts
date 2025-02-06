import { stringifyReferencePath } from "./reference";
import { createPathSegmentFromArrayIndex, createPathSegmentFromObjectKey } from "./path";

const stringifyRecursion = (parentObj: any, objReferenceMap: Map<Object,string>, path: string[]) => {
    if (typeof parentObj !== "object") {
        return;
    }

    let reference = stringifyReferencePath(path.join(""));
    objReferenceMap.set(parentObj, reference);

    if (Array.isArray(parentObj)) {
        for (let i = 0; i < parentObj.length; i++) {
            const childObject = parentObj[i];
            if (objReferenceMap.has(childObject)) {
                parentObj[i] = objReferenceMap.get(childObject);
                continue;
            }            
            stringifyRecursion(childObject, objReferenceMap, path.concat([createPathSegmentFromArrayIndex(i)]));
        }
        return;
    }

    for (const key in parentObj) {
        const childObject = parentObj[key];
        if (objReferenceMap.has(childObject)) {
            parentObj[key] = objReferenceMap.get(childObject);
            continue
        }
        stringifyRecursion(childObject, objReferenceMap, path.concat([createPathSegmentFromObjectKey(key)]));
    }
}

export const stringifyCircularReferences = (data: Object) => {
    stringifyRecursion(data, new Map<Object, string>(), []);
}