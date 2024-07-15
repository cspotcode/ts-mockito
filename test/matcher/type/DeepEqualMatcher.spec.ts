import {DeepEqualMatcher} from "../../../src/matcher/type/DeepEqualMatcher";
import {Matcher} from "../../../src/matcher/type/Matcher";
import {anyString, deepEqual, instance, mock, verify} from "../../../src/ts-mockito";

describe("DeepEqualMatcher", () => {
    describe("checking if two different instances of same number matches", () => {
        it("returns true", () => {
            // given
            const firstValue = 3;
            const secondValue = 3;
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeTruthy();
        });
    });

    describe("checking if two different instances of same string matches", () => {
        it("returns true", () => {
            // given
            const firstValue = "sampleString";
            const secondValue = "sampleString";
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeTruthy();
        });
    });

    describe("checking if two different instances of same nested objects matches", () => {
        it("returns true", () => {
            // given
            const firstValue = {a: 1, b: {c: 2}};
            const secondValue = {a: 1, b: {c: 2}};
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeTruthy();
        });
    });

    describe("checking if two nested objects matches when one leaf value is different", () => {
        it("returns true", () => {
            // given
            const firstValue = {a: 1, b: {c: 2}};
            const secondValue = {a: 1, b: {c: 99999}};
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeFalsy();
        });
    });

    describe("checking if expected value has Matcher as a value", () => {
        it("returns true if matcher returns true", () => {
            // given
            const firstValue = {a: 1, b: anyString()};
            const secondValue = {a: 1, b: "2"};
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeTruthy();
        });

        it("returns false if matcher returns false", () => {
            // given
            const firstValue = {a: 1, b: anyString()};
            const secondValue = {a: 1, b: 2};
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeFalsy();
        });
    });
    describe('when given circular dependency', () => {
        type Bar = { bar?: Bar; };

        it('should verify successfully', async () => {
            // given
            const firstValue: Bar = {};
            firstValue.bar = {bar: firstValue};
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const secondValue: Bar = {};
            secondValue.bar = {bar: secondValue};
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeTruthy();
        });

        it('should reject gracefully', async () => {
            // given
            const firstValue: Bar = {};
            firstValue.bar = {bar: firstValue};
            const testObj: Matcher = new DeepEqualMatcher(firstValue);

            // when
            const secondValue: Bar = {};
            const result = testObj.match(secondValue);

            // then
            expect(result).toBeFalsy();
        });
    });
});

describe("deepEqual", () => {
    describe("using in verify statements", () => {
        it("can be used for equality", () => {
            class Foo {
                public add = (str: string, num: number, obj: {a: string}): number | null => null;
            }
            const foo = mock(Foo);
            instance(foo).add("1", 2, {a: "sampleValue"});
            verify(foo.add(deepEqual("1"), deepEqual(2), deepEqual({a: "sampleValue"}))).once();
        });

        describe('when given circular dependency', () => {
          type Bar = { bar?: Bar; };
          class Foo {
            public something = (bar: Bar): number | null => null;
          }

          it('should reject gracefully', async () => {
              const bar: Bar = {};
              bar.bar = {bar};

              const foo = mock(Foo);
              instance(foo).something(bar);

            try {
              // when

              verify(foo.something(deepEqual({}))).once();
              expect(true).toBe(false); // Above call should throw an exception
            } catch (e) {
              // then
              expect(e.message).toContain('Expected "something(deepEqual({}))" to be called 1 time(s). But has been called 0 time(s).\n');
              expect(e.message).toContain("Actual calls:\n");
              expect(e.message).toContain("something({\"bar\":{\"bar\":\"[Circular]\"}}");
            }
          });
        });
    });
});
