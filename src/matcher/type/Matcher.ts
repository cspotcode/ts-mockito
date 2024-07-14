export class Matcher<T = unknown> {
    public match(value: T): boolean {
        return false;
    }

    public toString(): string {
        return "";
    }
}
