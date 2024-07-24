export class ObjectPropertyCodeRetriever {
    public static getObject(object: any) {
        if (object.constructor.name === 'Object') return '';
        const props = Object.getOwnPropertyNames(object);
        return `
            const ${object.constructor.name} = {
                 ${props.flatMap(prop => {
                    const descriptor = Object.getOwnPropertyDescriptor(object, prop);
                    if (descriptor?.get || descriptor?.set) {
                        return [
                            descriptor?.get ? descriptor?.get.toString() : '',
                            descriptor?.set ? descriptor?.set.toString() : '',
                        ];
                    } else if (typeof object[prop] === 'function') {
                        const fnStr = String(object[prop]);
                        const isMethod = fnStr.startsWith(prop) || fnStr.startsWith(`async ${prop}`);
                        return `
                            ${isMethod ? fnStr : `${prop}: ${fnStr}`}
                        `;
                    }
                    return '';
            }).filter(Boolean).join(',\n')}
        }
        `;
    }

}
