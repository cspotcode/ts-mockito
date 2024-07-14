
export class ObjectPropertyCodeRetriever {
    public static getObject(object: any) {
        const props = Object.getOwnPropertyNames(object);
        return `class ${object.constructor.name} {
            ${props.map(prop => {
            let result = '';
            const descriptor = Object.getOwnPropertyDescriptor(object, prop);
            if (descriptor.get) {
                result += `
                    ${descriptor.get.toString()}
                    `;
            }
            if (descriptor.set) {
                result += `
                    ${descriptor.set.toString()}
                    `;
            }
            if (!descriptor.get && !descriptor.set && typeof object[prop] === 'function') {
                const propName = prop === 'constructor' ? 'mock_constructor' : '';
                const fnStr = String(object[prop]);
                result += `
                    ${propName ? propName + '=' : ''}${fnStr}
                `;
            }

            return result;
        }).join(`
        `)}
        }
        `;
    }

}
