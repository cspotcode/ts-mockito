import { Matcher } from "./Matcher";

export class EndsWithMatcher extends Matcher {
    constructor(private expectedValue: string) {
        super();
    }

    public match(value: string): boolean {
        return value && (typeof value === "string") && value.endsWith(this.expectedValue);
    }

    public toString(): string {
        return `endsWith(${this.expectedValue})`;
    }
}
