import {Matcher} from "./Matcher";

export class StrictEqualMatcher<T> extends Matcher<T> {
    constructor(private expectedValue: any) {
        super();
    }

    public match(value: T): boolean {
        return this.expectedValue === value;
    }

    public toString(): string {
        if (this.expectedValue instanceof Array) {
            return `strictEqual([${this.expectedValue}])`;
        } else {
            return `strictEqual(${this.expectedValue})`;
        }
    }
}
