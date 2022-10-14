import {
    ArgCaptor,
    ArgCaptor1,
    ArgCaptor10,
    ArgCaptor2,
    ArgCaptor3,
    ArgCaptor4,
    ArgCaptor5,
    ArgCaptor6,
    ArgCaptor7,
    ArgCaptor8,
    ArgCaptor9,
} from "./capture/ArgCaptor";
import {AnyFunctionMatcher} from "./matcher/type/AnyFunctionMatcher";
import {AnyNumberMatcher} from "./matcher/type/AnyNumberMatcher";
import {AnyOfClassMatcher} from "./matcher/type/AnyOfClassMatcher";
import {AnyStringMatcher} from "./matcher/type/AnyStringMatcher";
import {AnythingMatcher} from "./matcher/type/AnythingMatcher";
import {BetweenMatcher} from "./matcher/type/BetweenMatcher";
import {DeepEqualMatcher} from "./matcher/type/DeepEqualMatcher";
import {EndsWithMatcher} from "./matcher/type/EndsWithMatcher";
import {Matcher} from "./matcher/type/Matcher";
import {MatchingStringMatcher} from "./matcher/type/MatchingStringMatcher";
import {NotNullMatcher} from "./matcher/type/NotNullMatcher";
import {ObjectContainingMatcher} from "./matcher/type/ObjectContainingMatcher";
import {StartsWithMatcher} from "./matcher/type/StartsWithMatcher";
import {StrictEqualMatcher} from "./matcher/type/StrictEqualMatcher";
import {MethodStubSetter} from "./MethodStubSetter";
import {MethodStubVerificator} from "./MethodStubVerificator";
import {MethodToStub} from "./MethodToStub";
import {Mocker} from "./Mock";
import {Spy} from "./Spy";

export function spy<T>(instanceToSpy: T): T {
    return new Spy(instanceToSpy).getMock();
}

export function mock<T>(clazz: (new(...args: any[]) => T) | (Function & { prototype: T }) ): T;
export function mock<T>(clazz?: any): T;
export function mock<T>(clazz?: any): T {
    return new Mocker(clazz).getMock();
}

export function verify<T>(method: T): MethodStubVerificator {
    return new MethodStubVerificator(method as any);
}

export function when<T>(method: Promise<T>): MethodStubSetter<Promise<T>, T, Error>;
export function when<T>(method: T): MethodStubSetter<T>;
export function when<T>(method: any): any {
    return new MethodStubSetter(method);
}

export function instance<T>(mockedValue: T): T {
    const tsmockitoInstance = (mockedValue as any).__tsmockitoInstance as T;
    return tsmockitoInstance;
}

export function capture<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6, h: T7, i: T8, j: T9) => any): ArgCaptor10<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>;
export function capture<T0, T1, T2, T3, T4, T5, T6, T7, T8>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6, h: T7, i: T8) => any): ArgCaptor9<T0, T1, T2, T3, T4, T5, T6, T7, T8>;
export function capture<T0, T1, T2, T3, T4, T5, T6, T7>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6, h: T7) => any): ArgCaptor8<T0, T1, T2, T3, T4, T5, T6, T7>;
export function capture<T0, T1, T2, T3, T4, T5, T6>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5, g: T6) => any): ArgCaptor7<T0, T1, T2, T3, T4, T5, T6>;
export function capture<T0, T1, T2, T3, T4, T5>(method: (a: T0, b: T1, c: T2, d: T3, e: T4, f: T5) => any): ArgCaptor6<T0, T1, T2, T3, T4, T5>;
export function capture<T0, T1, T2, T3, T4>(method: (a: T0, b: T1, c: T2, d: T3, e: T4) => any): ArgCaptor5<T0, T1, T2, T3, T4>;
export function capture<T0, T1, T2, T3>(method: (a: T0, b: T1, c: T2, d: T3) => any): ArgCaptor4<T0, T1, T2, T3>;
export function capture<T0, T1, T2>(method: (a: T0, b: T1, c: T2) => any): ArgCaptor3<T0, T1, T2>;
export function capture<T0, T1>(method: (a: T0, b: T1) => any): ArgCaptor2<T0, T1>;
export function capture<T0>(method: (a: T0) => any): ArgCaptor1<T0>;
export function capture(method: (...args: any[]) => any): ArgCaptor {
    const methodStub: MethodToStub = method();
    if (methodStub instanceof MethodToStub) {
        const actions = methodStub.mocker.getActionsByName(methodStub.name);
        return new ArgCaptor(actions);
    } else {
        throw Error("Cannot capture from not mocked object.");
    }
}

export function reset<T>(...mockedValues: T[]): void {
    mockedValues.forEach(mockedValue => (mockedValue as any).__tsmockitoMocker.reset());
}

export function resetCalls<T>(...mockedValues: T[]): void {
    mockedValues.forEach(mockedValue => (mockedValue as any).__tsmockitoMocker.resetCalls());
}

export function anyOfClass<T>(expectedClass: new (...args: any[]) => T): Matcher {
    return new AnyOfClassMatcher(expectedClass);
}

export function anyFunction(): Matcher {
    return new AnyFunctionMatcher();
}

export function anyNumber(): Matcher {
    return new AnyNumberMatcher();
}

export function anyString(): Matcher {
    return new AnyStringMatcher();
}

export function anything(): any {
    return new AnythingMatcher();
}

export function between(min: number, max: number): Matcher {
    return new BetweenMatcher(min, max);
}

export function deepEqual<T>(expectedValue: T): DeepEqualMatcher<T> {
    return new DeepEqualMatcher<T>(expectedValue);
}

export function notNull(): Matcher {
    return new NotNullMatcher();
}

export function strictEqual<T>(expectedValue: T): Matcher {
    return new StrictEqualMatcher(expectedValue);
}

export function match(expectedValue: RegExp | string): Matcher {
    return new MatchingStringMatcher(expectedValue);
}

export function startsWith(expectedValue: string): Matcher {
    return new StartsWithMatcher(expectedValue);
}

export function endsWith(expectedValue: string): Matcher {
    return new EndsWithMatcher(expectedValue);
}

export function objectContaining(expectedValue: Object): Matcher {
    return new ObjectContainingMatcher(expectedValue);
}

// Export default object with all members (ember-browserify doesn't support named exports).
export default {
    spy,
    mock,
    verify,
    when,
    instance,
    capture,
    reset,
    resetCalls,
    anyOfClass,
    anyFunction,
    anyNumber,
    anyString,
    anything,
    between,
    deepEqual,
    notNull,
    strictEqual,
    match,
    startsWith,
    endsWith,
    objectContaining,
};
