import { Matcher } from "./Matcher";

export class StartsWithMatcher extends Matcher {
    constructor(private expectedValue: string) {
        super();
    }

    public match(value: string): boolean {
        return value && (typeof value === "string") && value.startsWith(this.expectedValue);
    }

    public toString(): string {
        return `startsWith(${this.expectedValue})`;
    }
}
