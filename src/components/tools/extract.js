import countPresence from "./countPresence.js";

export default function countPresences(recEntries, categories) {
    if (!Array.isArray(categories)) {
        throw new TypeError("Categories must be an array.");
    }

    return categories.map((category) => ({
        ...category,
        count: countPresence(recEntries, category.key),
        ...(Array.isArray(category.children)
            ? {
                    children: category.children.map((fineCategory) => ({
                        ...fineCategory,
                        count: countPresence(recEntries, fineCategory.key)
                    }))
                }
            : {})
    }));
}