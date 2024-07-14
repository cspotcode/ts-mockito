import {MockableFunctionsFinder} from "../../src/utils/MockableFunctionsFinder";

describe("MockableFunctionsFinder", () => {
    describe("searching for method names in code", () => {
        it("returns all called and defined functions", () => {
            // given
            const code = getSampleCode();

            // when
            const result = new MockableFunctionsFinder().find(code);

            // then
            expect(result).toContain("anonymousMethod");
            expect(result).toContain("convertNumberToString");
        });

        it("should not find hasOwnProperty as it should not be mocked (because its used by mockito to evaluate properties)", () => {
            // given
            const code = getSampleCode();

            // when
            const result = new MockableFunctionsFinder().find(code);

            // then
            expect(result["hasOwnProperty"] instanceof Function).toBeTruthy();
        });
    });

    describe("searching for method names in complex class code", () => {
        const mockableFunctionsFinder = new MockableFunctionsFinder();
        let mockableMethods: string[];

        beforeEach(() => {
            // tslint:disable-next-line:no-eval
            const object = getSampleComplexClassCode();
            mockableMethods = mockableFunctionsFinder.find(object);
        });

        it("should find existing property method", () => {
            expect(mockableMethods).toContain('testMethod');
            expect(mockableMethods).toContain('testMethod2');
            expect(mockableMethods).toContain('testMethod3');
        });

        it("should find existing existing property accessors", () => {
            expect(mockableMethods).toContain('someValue');
        });

        it("should not find non existent property", () => {
            expect(mockableMethods).not.toContain("nonExistentProperty");
        });
    });
});

function getSampleCode(): string {
    // tslint:disable-next-line:no-eval
    return eval(`
class Foo {
    constructor (temp) {
        this.anonymousMethod = function(arg) {
            console.log(arg);
            temp.hasOwnProperty("fakeProperty");
        }
    }

    convertNumberToString(value) {
        return value.toString();
    }
}

Foo;
`);
}

function getSampleComplexClassCode() {
    // tslint:disable-next-line:no-eval
    return eval(`
class InheritedTest {
    undefinedProperty = undefined;
    nullProperty = null;
    nanProperty = NaN;
    stringProperty = "stringProperty";
    booleanProperty = true;
    testMethod = () => true;
    testMethod2 = function () { return true };

    get someValue() {
        return "someValue";
    }

    set someValue(newValue) {
        console.info("someValue set");
    }
}

class Test extends InheritedTest {
    testMethod3() {
        return 'barbaz';
    }
}

Test;
`);
}