"use strict";

const assert = require("assert");
const { ansiEscapeCodes, blank, first, isBlank, partition, strlen, zeroWidthCharacters } = require(".");

describe("printable-characters", () => {
    it("determines visible length", () => {
        assert.strictEqual(strlen("💩"), 1);
        // assert.strictEqual(strlen("👩‍❤️‍💋‍👩"), 1); // FAILING, see https://blog.jonnew.com/posts/poo-dot-length-equals-two for possible solution
        assert.strictEqual(strlen("❤️"), 1);
        assert.strictEqual(strlen("foo bar"), 7);
        assert.strictEqual(strlen("\u001b[106mfoo bar\u001b[49m"), 7);
    });
    it("detects blank text", () => {
        assert.ok(!isBlank("💩"));
        assert.ok(!isBlank("foobar"));
        assert.ok(isBlank("\u001b[106m  \t  \t   \n     \u001b[49m"));
    });
    it("matches zero-width characters and ANSI escape codes", () => {
        let str = "\u001b[106mfoo\n\nbar\u001b[49m"
        assert.ok(str = str.replace(ansiEscapeCodes, ""), "foo\n\nbar");
        assert.ok(      str.replace(zeroWidthCharacters, ""), "foobar");
    });
    it("obtains blank string of the same width", () => {
        assert.strictEqual(blank("💩"), " ");
        // assert.strictEqual(blank("👩‍❤️‍💋‍👩"), " "); // FAILING, see https://blog.jonnew.com/posts/poo-dot-length-equals-two for possible solution
        assert.strictEqual(blank("❤️"), " ");
        assert.strictEqual(blank("foo"), "   ");
        assert.strictEqual(blank("\n"), "\n");
        assert.strictEqual(blank("\t"), "\t");
        assert.strictEqual(blank("\tfoo \nfoo"), "\t    \n   ");
        assert.strictEqual(blank("\u001b[22m\u001b[1mfoo \t\u001b[39m\u001b[22m"), "    \t");
    });
    it("extracts invisible parts followed by visible ones", () => {
        assert.deepStrictEqual(partition(""),                        [                                                   ]);
        assert.deepStrictEqual(partition("foo"),                     [["", "foo"]                                        ]);
        assert.deepStrictEqual(partition("\u001b[1mfoo"),            [["\u001b[1m", "foo"]                               ]);
        assert.deepStrictEqual(partition("\u001b[1mfoo\u0000bar"),   [["\u001b[1m", "foo"], ["\u0000", "bar"]            ]);
        assert.deepStrictEqual(partition("\u001b[1mfoo\u0000bar\n"), [["\u001b[1m", "foo"], ["\u0000", "bar"], ["\n", ""]]);
    });
    it("gets first N visible symbols (preserving invisible parts)", () => {
        assert.strictEqual(first("💩23456789", 0), "");
        assert.strictEqual(first("💩23456789", 3), "💩23");
        assert.strictEqual(first("💩23456789", 100), "💩23456789");

        const str = "\u001b[22m\u001b[1m💩23\u000045\u001b[39m67\n89\u001b[39m\u001b[22m"
        assert.strictEqual(first(str, 0),   "\u001b[22m\u001b[1m\u0000\u001b[39m\n\u001b[39m\u001b[22m");
        assert.strictEqual(first(str, 3),   "\u001b[22m\u001b[1m💩23\u0000\u001b[39m\n\u001b[39m\u001b[22m");
        assert.strictEqual(first(str, 4),   "\u001b[22m\u001b[1m💩23\u00004\u001b[39m\n\u001b[39m\u001b[22m");
        assert.strictEqual(first(str, 6),   "\u001b[22m\u001b[1m💩23\u000045\u001b[39m6\n\u001b[39m\u001b[22m");
        assert.strictEqual(first(str, 9),   "\u001b[22m\u001b[1m💩23\u000045\u001b[39m67\n89\u001b[39m\u001b[22m");
        assert.strictEqual(first(str, 100), "\u001b[22m\u001b[1m💩23\u000045\u001b[39m67\n89\u001b[39m\u001b[22m");
    });
});
