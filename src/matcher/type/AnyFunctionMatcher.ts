import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class AnyFunctionMatcher<T extends Function> extends Matcher<T> {
    constructor() {
        super();
    }

    public match(value: T): boolean {
        return _.isFunction(value);
    }

    public toString(): string {
        return "anyFunction()";
    }
}
