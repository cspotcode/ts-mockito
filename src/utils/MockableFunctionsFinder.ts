import {parse} from "@babel/parser";
import * as _babel_types from "@babel/types";
import {ObjectInspector} from "./ObjectInspector";
import {ObjectPropertyCodeRetriever} from "./ObjectPropertyCodeRetriever";
import {uniq} from "lodash";

type FunctionNode = |
    _babel_types.ObjectMethod |
    _babel_types.ClassMethod |
    _babel_types.ClassPrivateMethod |
    _babel_types.FunctionDeclaration |
    _babel_types.ClassProperty |
    _babel_types.Expression |
    _babel_types.FunctionExpression;

const methodTokenName = new Set([
    "ObjectMethod",
    "ClassMethod",
    "ClassPrivateMethod",
    "FunctionDeclaration",
    "FunctionExpression"
]);

const isFunctionNode = (node: _babel_types.Statement | FunctionNode): node is FunctionNode => methodTokenName.has(node.type);


function getAssignmentName(node: _babel_types.LVal): string | null {
    if (node.type === "Identifier")
        return node.name;

    if (node.type === "MemberExpression") {
        const prop = node.property;
        if (prop.type === 'Identifier') return prop.name;
        if (prop.type === 'PrivateName') return prop.id.name;
        return null;
    }

    return null;
}

function handleClassProp(node: _babel_types.ClassProperty): string | null {
    if (node.value?.type !== 'ArrowFunctionExpression' && node.value?.type !== 'FunctionExpression') return null;

    if ('name' in node.key) return node.key.name;
    if ('value' in node.key) return node.key.value.toString();
    return null;
}

function handleExpression(node: _babel_types.Expression): string | null {
    if ('expression' in node && typeof node.expression !== 'boolean') return handleExpression(node.expression);

    if (node.type === 'AssignmentExpression') {
        return getAssignmentName(node.left);
    }

    return null;
}

function handleVariable(node: _babel_types.VariableDeclaration): string[] {
    return node.declarations.filter(n => {
        if (n.init?.type === 'ArrowFunctionExpression') return true;
        if (n.init?.type === 'FunctionExpression') return true;
        return false;
    }).map(n => getAssignmentName(n.id)).filter(Boolean) as string[];
}

function extractFunctionNames(nodes: (_babel_types.Statement | FunctionNode)[]) {
    let names = [] as string[];
    nodes.forEach(node => {
        if (isFunctionNode(node)) {
            if ('key' in node) {
                if ('name' in node.key)
                    names.push(node.key.name);
                if ('value' in node.key)
                    names.push(node.key.value.toString());
            }
            if ('id' in node && node.id) names.push(node.id.name);
        }
        if ('body' in node) {
            names = [...extractFunctionNames(Array.isArray(node.body) ? node.body as _babel_types.Statement[] : [node.body as _babel_types.Statement]), ...names];
        }

        if (node.type === "ExpressionStatement") {
            const name = handleExpression(node.expression);
            if (name) names.push(name);
        }

        if (node.type === "VariableDeclaration") {
            names = [...handleVariable(node), ...names];
        }

        if (node.type === "ClassProperty") {
            const propName = handleClassProp(node);
            const funcNames = node.value ? extractFunctionNames([node.value]) : [];
            if (propName) names.push(propName);
            names = [...funcNames, ...names];
        }
    });

    return names;
}

/**
 * Looking for all function calls and declarations and provides an array of their names. The mechanism is greedy
 * and tries to match as many function names as it can find and not only those of inspecting class.
 *
 * Matching occurrences are:
 *     - [.]functionName(
 *     - [.]functionName = (
 *     - [.]functionName = function(
 *     - [.]functionName = function otherName(
 */
export class MockableFunctionsFinder {
    private excludedFunctionNames = new Set(["hasOwnProperty", "function"]);

    public find(clazz: any): string[] {
        const codes = this.getClassCodeAsStringWithInheritance(clazz);
        const names = codes.map(code => parse(code)).flatMap(ast => extractFunctionNames(ast.program.body));
        return uniq(names)
            .filter((functionName: string) => this.isMockable(functionName));
    }

    private isMockable(name: string | null | undefined): boolean {
        if (!name) return false;
        return !this.excludedFunctionNames.has(name);
    }

    private getClassCodeAsStringWithInheritance(clazz: any) {
        const classCode: string = typeof clazz.toString !== "undefined" ? clazz.toString() : "";
        return [classCode, ...ObjectInspector.getObjectPrototypes(clazz.prototype).map(ObjectPropertyCodeRetriever.getObject)];
    }
}
