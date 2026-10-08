// returns the count of entries where the specified category is present (value is 1)
export default function countPresence(recEntries, category) {
    if (!Array.isArray(recEntries)) {
        throw new TypeError("Recording entries must be an array.");
    }

    let count = 0;
    recEntries.forEach((entry) => {
        if (String(entry?.[category]) === "1") count += 1;
    });
    return count;
}