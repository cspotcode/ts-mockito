export class ObjectPropertyCodeRetriever {
    public getObject(object: any) {
        const props = Object.getOwnPropertyNames(object);
        return `class Prototype {
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
                const propName = prop === 'constructor' ? 'mock_constructor' : prop;
                result += `
                    ${propName} = ${String(object[prop])}
                `;
            }

            return result;
        }).join(`
        `)}
        }
        `;
    }

}
