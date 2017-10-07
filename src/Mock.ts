import {Matcher} from "./matcher/type/Matcher";
import {MethodAction} from "./MethodAction";
import {MethodStubCollection} from "./MethodStubCollection";
import {MethodToStub} from "./MethodToStub";
import {MethodStub} from "./stub/MethodStub";
import {ReturnValueMethodStub} from "./stub/ReturnValueMethodStub";
import {strictEqual} from "./ts-mockito";
import {MockableFunctionsFinder} from "./utils/MockableFunctionsFinder";
import {traverseObjectOwnProperties, traversePrototypeChain} from "./utils/ObjectTraverseFunctions";
import {ObjectPropertyCodeRetriever} from "./utils/PrototypeKeyCodeGetter";

export class Mocker {
    private methodStubCollections: any = {};
    private methodActions: MethodAction[] = [];
    private mock: any = {};
    private mockableFunctionsFinder = new MockableFunctionsFinder();
    private objectPropertyCodeRetriever = new ObjectPropertyCodeRetriever();

    constructor(private clazz: any, protected instance: any = {}) {
        this.mock.__tsmockitoInstance = this.instance;
        this.mock.__tsmockitoMocker = this;
        if (this.clazz && this.clazz.prototype != null && this.clazz.prototype !== Object.prototype) {
            this.processProperties();
            this.processClassCode();
            this.processFunctionsCode();
        }
    }

    public getMock(): any {
        if (typeof Proxy === "undefined") {
            return this.mock;
        }

        return new Proxy(this.mock, this.createCatchAllHandlerForRemainingPropertiesWithoutGetters());
    }

    public createCatchAllHandlerForRemainingPropertiesWithoutGetters(): ProxyHandler<any> {
        return {
            get: (target: any, name: PropertyKey) => {
                const hasMethodStub = name in target;
                if (!hasMethodStub) {
                    this.createPropertyStub(name.toString());
                    this.createInstancePropertyDescriptorListener(name.toString(), {}, this.clazz.prototype);
                }
                return target[name];
            },
        };
    }

    public reset(): void {
        this.methodStubCollections = {};
        this.methodActions = [];
    }

    public resetCalls(): void {
        this.methodActions = [];
    }

    public getAllMatchingActions(methodName: string, matchers: Array<Matcher>): Array<MethodAction> {
        const result: MethodAction[] = [];

        this.methodActions.forEach((item: MethodAction) => {
            if (item.isApplicable(methodName, matchers)) {
                result.push(item);
            }
        });
        return result;
    }

    public getFirstMatchingAction(methodName: string, matchers: Array<Matcher>): MethodAction {
        return this.getAllMatchingActions(methodName, matchers)[0];
    }

    public getActionsByName(name: string): MethodAction[] {
        return this.methodActions.filter(action => action.methodName === name);
    }

    protected processProperties(prototype: any = this.clazz.prototype): void {
        traversePrototypeChain(prototype, (proto: any) => {
            traverseObjectOwnProperties(proto, (name: string) => {
                const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                if (descriptor.get) {
                    this.createPropertyStub(name);
                    this.createInstancePropertyDescriptorListener(name, descriptor, proto);
                } else {
                    this.createMethodStub(name);
                }
                this.createInstanceActionListener(name, proto);
            });
        });
    }

    protected createInstancePropertyDescriptorListener(key: string,
                                                       descriptor: PropertyDescriptor,
                                                       prototype: any): void {
        if (this.instance.hasOwnProperty(key)) {
            return;
        }

        Object.defineProperty(this.instance, key, {
            get: this.createActionListener(key),
        });
    }

    protected createInstanceActionListener(key: string, prototype: any): void {
        if (this.instance.hasOwnProperty(key)) {
            return;
        }

        this.instance[key] = this.createActionListener(key);
    }

    protected createActionListener(key: string): () => any {
        return (...args) => {
            const action: MethodAction = new MethodAction(key, args);
            this.methodActions.push(action);
            const methodStub = this.getMethodStub(key, args);
            methodStub.execute(args);
            return methodStub.getValue();
        };
    }

    protected getEmptyMethodStub(key: string, args: any[]): MethodStub {
        return new ReturnValueMethodStub(-1, [], null);
    }

    private processClassCode(): void {
        const subKeys = this.mockableFunctionsFinder.find(this.clazz.toString());
        traverseObjectOwnProperties(subKeys, (subKey: string) => {
            this.createMethodStub(subKey);
            this.createInstanceActionListener(subKey, this.clazz.prototype);
        });
    }

    private processFunctionsCode(): void {
        traverseObjectOwnProperties(this.clazz.prototype, (key: string) => {
            const subKeys = this.mockableFunctionsFinder.find(this.objectPropertyCodeRetriever.get(this.clazz.prototype, key));
            traverseObjectOwnProperties(subKeys, (subKey: string) => {
                this.createMethodStub(subKey);
                this.createInstanceActionListener(subKey, this.clazz.prototype);
            });
        });
    }

    private createPropertyStub(key: string): void {
        if (this.mock.hasOwnProperty(key)) {
            return;
        }

        Object.defineProperty(this.mock, key, {
            get: this.createMethodToStub(key),
        });
    }

    private createMethodStub(key) {
        if (this.mock.hasOwnProperty(key)) {
            return;
        }

        this.mock[key] = this.createMethodToStub(key);
    }

    private createMethodToStub(key: string): () => any {
        return (...args) => {
            if (!this.methodStubCollections[key]) {
                this.methodStubCollections[key] = new MethodStubCollection();
            }

            const matchers: Matcher[] = [];

            for (const arg of args) {
                if (!(arg instanceof Matcher)) {
                    matchers.push(strictEqual(arg));
                } else {
                    matchers.push(arg);
                }
            }

            return new MethodToStub(this.methodStubCollections[key], matchers, this, key);
        };
    }

    private getMethodStub(key: string, args: any[]): MethodStub {
        const methodStub: MethodStubCollection = this.methodStubCollections[key];
        if (methodStub && methodStub.hasMatchingInAnyGroup(args)) {
            const groupIndex = methodStub.getLastMatchingGroupIndex(args);
            return methodStub.getFirstMatchingFromGroupAndRemoveIfNotLast(groupIndex, args);
        } else {
            return this.getEmptyMethodStub(key, args);
        }
    }
}
