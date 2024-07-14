import {Matcher} from "../matcher/type/Matcher";

type MockedArgs<T extends Array<unknown>> = {
    [I in keyof T]: Matcher<T[I]> | T[I]
};

export type MockedProp<T> =
    T extends (...args:infer Args) => infer R ?
        (...args:MockedArgs<Args>) => R :
        T;

export type Mocked<T> = {
    [prop in keyof T]: MockedProp<T[prop]>
};
