import * as _ from "lodash";
import {Matcher} from "./Matcher";

export class AnyNumberMatcher extends Matcher<number> {
    constructor() {
        super();
    }

    public match(value: number): boolean {
        return _.isNumber(value);
    }

    public toString(): string {
        return "anyNumber()";
    }
}
