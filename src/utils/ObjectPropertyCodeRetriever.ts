
export class ObjectPropertyCodeRetriever {
    public static getObject(object: any) {
        if(object.constructor.name === 'Object') return '';
        const props = Object.getOwnPropertyNames(object);
        return `class ${object.constructor.name} {
            ${props.map(prop => {
            let result = '';
            const descriptor = Object.getOwnPropertyDescriptor(object, prop);
            if (descriptor?.get) {
                result += `
                    ${descriptor?.get.toString()}
                    `;
            }
            if (descriptor?.set) {
                result += `
                    ${descriptor?.set.toString()}
                    `;
            }
            if (!descriptor?.get && !descriptor?.set && typeof object[prop] === 'function') {
                const propName = prop === 'constructor' ? 'mock_constructor' : prop;
                const fnStr = String(object[prop]);
                const addAssignment = prop === 'constructor' || fnStr.startsWith('function ');
                result += `
                    ${addAssignment ? `${propName}=` : ''}${fnStr}
                `;
            }

            return result;
        }).join(`
        `)}
        }
        `;
    }

}
