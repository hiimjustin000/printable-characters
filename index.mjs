// https://blog.jonnew.com/posts/poo-dot-length-equals-two

const partitioner = /((?:[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><])|[\t\n\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f])?([^\t\n\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f]*)/g;
const zeroWidthNonLineTerms = /(?:[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><])|[\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f]/g;

/**
 * A regular expression to match ANSI escape codes.
 * @type {RegExp}
 */
export const ansiEscapeCodes = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;

/**
 * A regular expression to match zero-width characters.
 * @type {RegExp}
 */
export const zeroWidthCharacters = /(?:[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><])|[\n\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f]/g;

/**
 * Returns a blank string with the same width as the provided string.
 * @param {string} input
 * @returns {string}
 */
export function blank(input) {
    return Array.from(input.replace(zeroWidthNonLineTerms, "")).map(x => (x == "\t" || x == "\n") ? x : " ").join("");
}

/**
 * Returns the first visible characters of the provided string, with the invisible parts preserved.
 * @param {string} input
 * @param {number} length
 * @returns {string}
 */
export function first(input, length) {
    return partition(input).reduce((a, x) => {
        const text = Array.from(x[1]).slice(0, length - a[1]);
        return [a[0] + x[0] + text.join(""), a[1] + text.length];
    }, ["", 0])[0];
}

/**
 * Returns `true` if there are no visible characters in the provided string, otherwise `false`.
 * @param {string} input
 * @returns {boolean}
 */
export function isBlank(input) {
    return input.replace(zeroWidthCharacters, "").replace(/\s/g, "").length <= 0;
}

/**
 * Returns a list of matches that contain an invisible part of the provided string followed by a visible one.
 * @param {string} input
 * @returns {string[][]}
 */
export function partition(input) {
    return Array.from(input.matchAll(partitioner)).filter(x => x.index < input.length).map(x => [x[1] ?? "", x[2]]);
}

/**
 * Returns the visible length of the provided string.
 * @param {string} input
 * @returns {number}
 */
export function strlen(input) {
    return Array.from(input.replace(zeroWidthCharacters, "")).length;
}
