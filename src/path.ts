export const createPathSegmentFromArrayIndex = (index: number) => {
    return "[" + index + "]";
}

export const createPathSegmentFromObjectKey = (key: string) => {
    return '["' + key + '"]';
}

export const joinPath = (pathSegments: string[]) => {
    return pathSegments.join("");
}

const trimString = (string: string, char: string) => {
    while (string.startsWith(char)) {
        string = string.substring(1);
    }
    while (string.endsWith(char)) {
        string = string.substring(0, string.length - 1);
    }
    return string;
}

export const splitPath = (path: string) => {
    if (path === "") {
        return [];
    }
    const pathSegmentStrings = path.split( "][");
    return pathSegmentStrings.map((segmentString, index) => {
        segmentString = trimString(segmentString, "[");
        segmentString = trimString(segmentString, "]");
        
        const isKey = segmentString.startsWith('"');
        if (isKey) {
            return trimString(segmentString, '"');
        }

        return parseInt(segmentString);
    });
}