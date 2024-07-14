import {Matcher} from "./Matcher";

export class MatchingStringMatcher extends Matcher<string> {
    constructor(private expectedValue: RegExp | string) {
        super();
    }

    public match(value: string): boolean {
        return Boolean(value.match(this.expectedValue));
    }

    public toString(): string {
        return `match(${this.expectedValue})`;
    }
}
