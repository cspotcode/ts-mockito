import { describe, it, expect } from "vitest";
import {mock} from "../src/ts-mockito";

const TestClass = class {
    private readonly foo = "abc";
};

describe("anonymous class test", () => {
    const testMock = mock(TestClass);

    it("should be defined", () => {
        expect(testMock).toBeDefined();
    });
});