import {ObjectPropertyCodeRetriever} from "../../src/utils/ObjectPropertyCodeRetriever";

describe("ObjectPropertyCodeRetriever", () => {
    describe("Properties code retrieving", () => {
        const objectPropertyCodeRetriever: ObjectPropertyCodeRetriever = new ObjectPropertyCodeRetriever();
        let object: any;

        beforeEach(() => {
            object = {
                undefinedProperty: undefined,
                nullProperty: null,
                nanProperty: NaN,
                stringProperty: "stringProperty",
                booleanProperty: true,
                testMethod: () => true,
                get someValue(): string {
                    return "someValue";
                },
                set someValue(newValue: string) {
                    console.info("someValue set");
                },
            };
        });

        it("Provides code of given existing property method", () => {
            const objStr = objectPropertyCodeRetriever.getObject(object);
            expect(objStr).toContain('testMethod = function () { return true; }');
        });

        it("Provides code of given existing property accessors", () => {
            const objStr = objectPropertyCodeRetriever.getObject(object);
            expect(objStr).toMatch(/get someValue\(\) \{\s*return "someValue";\s*}/);
            expect(objStr).toMatch(/set someValue\(newValue\) \{\s*console.info\("someValue set"\);\s*}/);
        });

        it("Returns empty string when checking non existent property", () => {
            const objStr = objectPropertyCodeRetriever.getObject(object);
            expect(objStr).not.toContain("nonExistentProperty");
        });
    });
});
