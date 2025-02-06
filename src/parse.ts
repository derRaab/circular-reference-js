import { createPathSegmentFromArrayIndex, createPathSegmentFromObjectKey } from "./path";
import { parseReferencePath } from "./reference";


const collectObjectPaths = (parentObj: any, objPathMap: Map<Object,string>, path: string[]) => {
    if (typeof parentObj !== "object") {
        return;
    }
    
    objPathMap.set(parentObj, path.join(""));

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

const parseRecursion = (parentObj: any, objPathMap: Map<any,string>, pathObjectMap: Map<string, any>) => {
    if (typeof parentObj !== "object") {
        return;
    }

    if (Array.isArray(parentObj)) {
        for (let i = 0; i < parentObj.length; i++) {
            const childObject: any = parentObj[i];
            if (typeof childObject === "string") {
                const path = parseReferencePath(childObject);
                if (path !== null) {
                    const referenceObject = pathObjectMap.get(path);
                    if (referenceObject) {
                        parentObj[i] = referenceObject;
                    }
                    else {
                        throw new Error(childObject + " not resolved");
                    }
                }
                continue;
            }
            parseRecursion(childObject, objPathMap, pathObjectMap);
        }
        return;
    }

    for (const key in parentObj) {
        const childObject: any = parentObj[key];
        if (typeof childObject === "string") {
            const path = parseReferencePath(childObject);
            if (path !== null) {
                const referenceObject = pathObjectMap.get(path);
                if (referenceObject) {
                    parentObj[key] = referenceObject;
                }
                else {
                    throw new Error(childObject + " not resolved");
                }
            }
            continue;
        }
        parseRecursion(childObject, objPathMap, pathObjectMap);
    }
}

export const parseCircularReferences = (data: Object) => {
    const objPathMap = new Map<Object, string>();
    collectObjectPaths(data, objPathMap, []);

    const pathObjectMap = new Map<string, Object>();
    for (const [object, path] of objPathMap) {
        pathObjectMap.set(path, object);
    }

    parseRecursion(data, new Map<any, string>(), pathObjectMap);
}