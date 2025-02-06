const PATH_PREFIX = "<<CircularReference path='";
const PATH_SUFFIX = "'>>";

export const stringifyReferencePath = (path: string) => {
    return PATH_PREFIX + path + PATH_SUFFIX;
}

export const parseReferencePath = (reference: string) => {
    let pathStartIndexOf = reference.indexOf(PATH_PREFIX);
    if (pathStartIndexOf === -1) {
        return null;
    }
    pathStartIndexOf += PATH_PREFIX.length;

    const pathEndIndexOf = reference.indexOf(PATH_SUFFIX, pathStartIndexOf);
    if (pathEndIndexOf === -1) {
        return null;
    }
    
    return reference.substring(pathStartIndexOf, pathEndIndexOf);
}