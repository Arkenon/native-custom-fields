let counter = 0;

export function generateUniqueId() {
    counter++;
    return `node_${Date.now()}_${counter}`;
}
