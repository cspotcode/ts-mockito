import { Mocker } from "../src/Mock";
import {anything, instance, mock, reset, verify, when} from "../src/ts-mockito";
import {Foo} from "./utils/Foo";
import {Mocked} from "../src/utils/types";

describe("resetting mocked object", () => {
    let mockedFoo: Mocked<Foo>;
    let foo: Foo;

    beforeEach(() => {
        mockedFoo = mock(Foo);
        foo = instance(mockedFoo);
    });

    describe("when method has been called once", () => {
        describe("but later stub has been reset", () => {
            it("shows that never been called", () => {
                // given
                foo.getBar();
                verify(mockedFoo.getBar()).once();

                // when
                reset(mockedFoo);

                // then
                verify(mockedFoo.getBar()).never();
            });
        });
    });

    describe("when method has been called thrice", () => {
        describe("but later stub has been reset", () => {
            it("shows that never been called", () => {
                // given
                foo.getBar();
                foo.getBar();
                foo.getBar();
                verify(mockedFoo.getBar()).thrice();

                // when
                reset(mockedFoo);

                // then
                verify(mockedFoo.getBar()).never();
            });
        });
    });

    describe("when method has been called with arguments twice", () => {
        describe("but later stub has been reset", () => {
            it("shows that never been called", () => {
                // given
                foo.sumTwoNumbers(2, 3);
                foo.sumTwoNumbers(2, 3);
                verify(mockedFoo.sumTwoNumbers(2, 3)).twice();

                // when
                reset(mockedFoo);

                // then
                verify(mockedFoo.sumTwoNumbers(2, 3)).never();
                verify(mockedFoo.sumTwoNumbers(anything(), anything())).never();
            });
        });
    });

    describe("when two different methods has been called twice", () => {
        describe("but later stub has been reset", () => {
            it("shows that never been called", () => {
                // given
                foo.getBar();
                foo.getBar();
                foo.sumTwoNumbers(2, 3);
                foo.sumTwoNumbers(2, 3);
                verify(mockedFoo.getBar()).twice();
                verify(mockedFoo.sumTwoNumbers(2, 3)).twice();

                // when
                reset(mockedFoo);

                // then
                verify(mockedFoo.getBar()).never();
                verify(mockedFoo.sumTwoNumbers(2, 3)).never();
                verify(mockedFoo.sumTwoNumbers(anything(), anything())).never();
            });
        });
    });

    describe("when two different methods has been called", () => {
        describe("but later stub has been reset", () => {
            it("throws exception with information that methods has not been called", () => {
                // given
                foo.getBar();
                foo.sumTwoNumbers(2, 3);
                verify(mockedFoo.getBar()).calledBefore(mockedFoo.sumTwoNumbers(2, 3));

                // when
                reset(mockedFoo);

                // then
                try {
                    verify(mockedFoo.getBar()).calledBefore(mockedFoo.sumTwoNumbers(2, 3));
                    fail();
                } catch (e) {
                    expect(e.message).toContain("to be called before");
                    expect(e.message).toContain("but none of them has been called");
                }
            });
        });
    });

    describe("when two different methods has been after", () => {
        describe("but later stub has been reset", () => {
            it("throws exception with information that methods has not been called", () => {
                // given
                foo.getBar();
                foo.sumTwoNumbers(2, 3);
                verify(mockedFoo.sumTwoNumbers(2, 3)).calledAfter(mockedFoo.getBar());

                // when
                reset(mockedFoo);

                // then
                try {
                    verify(mockedFoo.sumTwoNumbers(2, 3)).calledAfter(mockedFoo.getBar());
                    fail();
                } catch (e) {
                    expect(e.message).toContain("to be called after");
                    expect(e.message).toContain("but none of them has been called");
                }
            });
        });
    });

    describe("when object has been stubbed", () => {
        describe("but later stub has been reset", () => {
            it("should reset configured stubs", () => {
                // given
                when(mockedFoo.convertNumberToString(3)).thenReturn("three");
                reset(mockedFoo);

                // when
                const result: string = foo.convertNumberToString(3);

                // then
                expect(result).toBeNull();
            });
        });
    });

    describe("when object has been stubbed", () => {
        describe("but later stub has been reset", () => {
            it("should be able to setup new stubs", () => {
                // given
                when(mockedFoo.convertNumberToString(3)).thenReturn("three");
                reset(mockedFoo);
                when(mockedFoo.convertNumberToString(3)).thenReturn("newStubbedValue");

                // when
                const result: string = foo.convertNumberToString(3);

                // then
                expect(result).toEqual("newStubbedValue");
            });
        });
    });

    it("should reset all passed mocks", () => {
        if (typeof Proxy === "undefined") {
            pending("Testing browser doesn't support Proxy.");
        }

        // given
        const firstMock = mock<Mocker>();
        const secondMock = mock<Mocker>();

        // when
        reset({__tsmockitoMocker: instance(firstMock)}, {__tsmockitoMocker: instance(secondMock)});

        // then
        verify(firstMock.reset()).once();
        verify(secondMock.reset()).once();
    });
});
