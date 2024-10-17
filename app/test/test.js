function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function searchPattern(text, pattern) {
    const escapedPattern = escapeRegExp(pattern);
    const regex = new RegExp(escapedPattern, 'g');
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        matches.push({
            match: match[0],
            index: match.index
        });
    }

    return matches;
}