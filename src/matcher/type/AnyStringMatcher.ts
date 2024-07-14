import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class AnyStringMatcher extends Matcher<string> {
    constructor() {
        super();
    }

    public match(value: string): boolean {
        return _.isString(value);
    }

    public toString(): string {
        return "anyString()";
    }
}
