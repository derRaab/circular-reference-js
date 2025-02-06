export const createPathSegmentFromArrayIndex = (index: number) => {
    return "[" + index + "]";
}

export const createPathSegmentFromObjectKey = (key: string) => {
    return "." + key;
}