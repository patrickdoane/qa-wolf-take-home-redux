import { test } from "node:test";
import assert from "node:assert/strict";
import { assertNewestOrder } from "../../index.js";

const base = [
    { id: "1", title: "Newest", timestamp: "2024-08-20T12:00:00.000" },
    { id: "2", title: "Oldest", timestamp: "2024-08-18T12:00:00.000" }
];

test("accepts descending timestamps", () => {
    assertNewestOrder(base); // should not throw
});

test("allows equal timestamps", () => {
    assertNewestOrder([
        base[0],
        { ...base[0], id: "1a" },
    ]); // should not throw
});

test("fails when order increases", () => {
    assert.throws(
        () => assertNewestOrder([...base].reverse()),
        // Articles out of order, should throw
    );
});

test("fails fast on missing timestamp", () => {
    assert.throws(
        () => assertNewestOrder([{ id: "3", title: "bad" }]),
        // Missing timestamp, should throw
    );
});