export function extractContent(str) {
    const match = str.match(/:(.*?)(?=\()/);
    return match ? match[1].trim() : null; // Return the content or null if no match is found
}

export function extractLatterContent(str) {
    const match = str.match(/\/(.*?)(?=\))/);
    return match ? match[1].trim() : null; // Return the content or null if no match is found
}
