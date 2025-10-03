import { test, expect } from "@playwright/test";
import { assertNewestOrder } from "../../index.js";

const base = [
    { id: "1", title: "Newest", timestamp: "2024-08-20T12:00:00.000" },
    { id: "2", title: "Oldest", timestamp: "2024-08-18T12:00:00.000" }
];

// Correct descending order should pass
test("accepts descending timestamps", () => {
    expect(() => assertNewestOrder(base)).not.toThrow();
});

// Equal timestamps should be allowed
test("allows equal timestamps", () => {
    expect(() => {
        assertNewestOrder([
            base[0],
            { ...base[0], id: "1a" }
        ])
    }).not.toThrow();
});

// Reversed order should fail
test("fails when order increases", () => {
    expect(() => assertNewestOrder([...base].reverse())).toThrow();
});

// Missing timestamp should cause a fast failure
test("fails fast on missing timestamp", () => {
    expect(() => {
        assertNewestOrder([{ id: "3", title: "bad" }])
    }).toThrow();
});

// Invalid timestamp should cause a fast failure
test("fails fast on invalid timestamp", () => {
    expect(() => {
        assertNewestOrder([{ id: "3", title: "bad", timestamp: "invalid" }])
    }).toThrow();
});