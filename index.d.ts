declare module "printable-characters" {
    /** A regular expression to match ANSI escape codes. */
    export const ansiEscapeCodes: RegExp;
    /** A regular expression to match zero-width characters. */
    export const zeroWidthCharacters: RegExp;
    /** Returns the visible length of the provided string. */
    export function strlen(input: string): number;
    /** Returns `true` if there are no visible characters in the provided string, otherwise `false`. */
    export function isBlank(input: string): boolean;
    /** Returns a blank string with the same width as the provided string. */
    export function blank(input: string): string;
    /** Returns a list of matches that contain an invisible part of the provided string followed by a visible one. */
    export function partition(input: string): string[][];
    /** Returns the first visible characters of the provided string, with the invisible parts preserved. */
    export function first(input: string, length: number): string;
}
