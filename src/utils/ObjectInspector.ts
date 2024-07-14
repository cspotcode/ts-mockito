import * as _ from "lodash";


export class ObjectInspector {
    public static getObjectPrototypes(prototype: any): any[] {
        const prototypes: any[] = [];
        while (_.isObject(prototype) && (prototype !== Object.prototype && prototype !== Function.prototype)) {
            prototypes.push(prototype);
            prototype = Object.getPrototypeOf(prototype);
        }
        return prototypes;
    }

    public static getObjectOwnPropertyNames(object: any): string[] {
        return _.isObject(object) ? Object.getOwnPropertyNames(object) : [];
    }
}
