import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class ObjectContainingMatcher<T extends Object> extends Matcher<T> {
    constructor(private expectedValue: any) {
        super();
    }

    public match(value: T): boolean {
        return _.isMatch(value, this.expectedValue);
    }

    public toString(): string {
        return `objectContaining(${JSON.stringify(this.expectedValue)})`;
    }
}
