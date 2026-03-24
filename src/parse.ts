import { createPathSegmentFromArrayIndex, createPathSegmentFromObjectKey, joinPath } from "./path";
import { parseReferencePath, stringifyReferencePath } from "./reference";


const collectObjectPaths = (parentObj: Record<string,unknown> | unknown, objPathMap: Map<unknown,string>, path: string[]) => {
    if (typeof parentObj !== "object") {
        return;
    }
    
    objPathMap.set(parentObj, joinPath(path));

    if (Array.isArray(parentObj)) {
        for (let i = 0; i < parentObj.length; i++) {
            collectObjectPaths(parentObj[i], objPathMap, path.concat([createPathSegmentFromArrayIndex(i)]));
        }
        return;
    }

    for (const key in parentObj) {
        collectObjectPaths(parentObj[key], objPathMap, path.concat([createPathSegmentFromObjectKey(key)]));
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseRecursion = (parentObj: any, objReferenceMap: Map<object,string>, pathObjectMap: Map<string, any>, path: string[], unresolvedReferences: string[]) => {
    if (typeof parentObj !== "object") {
        return;
    }

    const reference = stringifyReferencePath(joinPath(path));
    objReferenceMap.set(parentObj, reference);

    if (Array.isArray(parentObj)) {
        for (let i = 0; i < parentObj.length; i++) {
            const childObject = parentObj[i];

            if (objReferenceMap.has(childObject)) {
                parentObj[i] = objReferenceMap.get(childObject);
                continue;
            }

            if (typeof childObject === "string") {
                const path = parseReferencePath(childObject);
                if (path !== null) {
                    const referenceObject = pathObjectMap.get(path);
                    if (referenceObject) {
                        parentObj[i] = referenceObject;
                    }
                    else {
                        unresolvedReferences.push(childObject);
                    }
                }
                continue;
            }
            parseRecursion(childObject, objReferenceMap, pathObjectMap, path.concat([createPathSegmentFromArrayIndex(i)]), unresolvedReferences);
        }
        return;
    }

    for (const key in parentObj) {
        const childObject = parentObj[key];

        if (objReferenceMap.has(childObject)) {
            parentObj[key] = objReferenceMap.get(childObject);
            continue
        }

        if (typeof childObject === "string") {
            const path = parseReferencePath(childObject);
            if (path !== null) {
                const referenceObject = pathObjectMap.get(path);
                if (referenceObject) {
                    parentObj[key] = referenceObject;
                }
                else {
                    unresolvedReferences.push(childObject);
                }
            }
            continue;
        }
        parseRecursion(childObject, objReferenceMap, pathObjectMap, path.concat([createPathSegmentFromObjectKey(key)]), unresolvedReferences);
    }
}

export const parseCircularReferences = (data: object, clone = false) => {
    if (clone) {
        data = structuredClone(data);
    }
    // Sometimes referenced objects are not yet parsed. We need to parse the data multiple times until all references are resolved.
    let unresolvedReferencesLength = -1;
    let unresolvedReferences: string[] = [];
    while (unresolvedReferencesLength !== unresolvedReferences.length) {
        unresolvedReferencesLength = unresolvedReferences.length;
        unresolvedReferences = [];

        // Collect all existing object paths
        const objPathMap = new Map<object, string>();
        collectObjectPaths(data, objPathMap, []);
        const pathObjectMap = new Map<string, object>();
        for (const [object, path] of objPathMap) {
            pathObjectMap.set(path, object);
        }

        parseRecursion(data, new Map<object, string>(), pathObjectMap, [], unresolvedReferences);
    }
}