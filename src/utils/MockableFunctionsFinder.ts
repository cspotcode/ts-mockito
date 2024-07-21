import {parse} from "@babel/parser";
import * as _babel_types from "@babel/types";
import {ObjectInspector} from "./ObjectInspector";
import {ObjectPropertyCodeRetriever} from "./ObjectPropertyCodeRetriever";
import {uniq} from "lodash";
import {
    AssignmentExpression,
    Block,
    Class,
    ClassExpression,
    Expression,
    Identifier,
    LVal,
    NumericLiteral, ObjectExpression,
    PrivateName, Program,
    SpreadElement,
    Statement,
    StringLiteral,
    UnaryLike,
} from "@babel/types";

const methodTokenName = new Set([
    "ObjectMethod",
    "ClassMethod",
    "ClassPrivateMethod",
    "FunctionDeclaration",
    "FunctionExpression"
]);

function getPropName(n: Identifier | StringLiteral | NumericLiteral | _babel_types.Expression | PrivateName): string[] {
    if ('name' in n) return [n.name];
    if ('value' in n) return [n.value.toString()];
    if (n.type === 'PrivateName') return getPropName(n.id);
    return handleExpression(n);
}

function handleAssignment(n: AssignmentExpression): string[] {
    if (methodTokenName.has(n.right.type))
        return [...handleLVal(n.left), ...handleExpression(n.right)];
    return handleExpression(n.right);
}

function handleObject(n: ObjectExpression): string[] {
    const names = [] as string[];
    n.properties.forEach(p => {
        if ('key' in p) names.push(...getPropName(p.key));
        if ('body' in p) names.push(...p.body.body.flatMap(handleStatement));
        if ('value' in p) names.push(...handleExpression(p.value as Expression));
    });
    return names;
}

const isSpread = (n: any): n is SpreadElement => n.type === 'SpreadElement';

function handleExpression(n?: Expression | null): string[] {
    if (!n) return [];
    switch (n.type) {
        case "ArrayExpression":
            return n.elements.flatMap(n => isSpread(n) ? handleUnaryLike(n) : handleExpression(n));
        case "AssignmentExpression":
            return handleAssignment(n);
        case "BinaryExpression":
            return [...(n.left.type !== 'PrivateName' ? handleExpression(n.left) : []), ...handleExpression(n.right)];
        case "CallExpression":
            return n.arguments.flatMap(n => {
                if (n.type === 'JSXNamespacedName') return [];
                if (n.type === 'ArgumentPlaceholder') return [];
                return isSpread(n) ? handleUnaryLike(n) : handleExpression(n);
            });
        case "ConditionalExpression":
            return [...handleExpression(n.test), ...handleExpression(n.consequent), ...handleExpression(n.alternate)];
        case "FunctionExpression":
            return handleBlock(n.body);
        case "Identifier":
            return [n.name];
        case "LogicalExpression":
            return [...handleExpression(n.left), ...handleExpression(n.right)];
        case "MemberExpression":
            return n.property.type === 'PrivateName' ? handleExpression(n.property.id) : handleExpression(n.property);
        case "ObjectExpression":
            return handleObject(n);
        case "SequenceExpression":
            return n.expressions.flatMap(handleExpression);
        case "ParenthesizedExpression":
            return handleExpression(n.expression);
        case "UnaryExpression":
        case "UpdateExpression":
        case "YieldExpression":
        case "AwaitExpression":
            return handleExpression(n.argument);
        case "ArrowFunctionExpression":
            return n.body.type === 'BlockStatement' ? handleBlock(n.body) : handleExpression(n.body);
        case "ClassExpression":
            return handleClass(n);
        case "TaggedTemplateExpression":
            return handleExpression(n.tag);
        case "TemplateLiteral":
            return n.expressions.flatMap(e => handleExpression(e as Expression));
        case "OptionalMemberExpression":
            return [...(n.property.type !== 'Identifier' ? handleExpression(n.property) : [])];
        case "OptionalCallExpression":
            return n.arguments.flatMap(a => {
                if (a.type === 'SpreadElement') return handleExpression(a.argument);
                if (a.type === 'JSXNamespacedName') return [];
                if (a.type === 'ArgumentPlaceholder') return [];
                return handleExpression(a);
            });
        case "BindExpression":
            return handleExpression(n.object);
        case "DoExpression":
            return handleBlock(n.body);
        case "RecordExpression":
        case "NewExpression":
        case "StringLiteral":
        case "NumericLiteral":
        case "BooleanLiteral":
        case "RegExpLiteral":
        case "NullLiteral":
        case "ThisExpression":
        case "MetaProperty":
        case "Super":
        case "Import":
        case "BigIntLiteral":
        case "TypeCastExpression":
        case "JSXElement":
        case "JSXFragment":
        case "PipelinePrimaryTopicReference":
        case "TupleExpression":
        case "DecimalLiteral":
        case "ModuleExpression":
        case "TSAsExpression":
        case "TSTypeAssertion":
        case "TSNonNullExpression":
        default:
            return [];
    }
}

function handleBlock(n?: Block | null): string[] {
    if (!n) return [];
    return n.body.flatMap(handleStatement);
}

function handleStatement(n: Statement): string[] {
    switch (n.type) {
        case "BlockStatement":
            return n.body.flatMap(handleStatement)
        case "DoWhileStatement":
            return [...handleExpression(n.test), ...handleStatement(n.body)];
        case "ExpressionStatement":
            return handleExpression(n.expression);
        case "ForInStatement":
            return [...handleExpression(n.right), ...handleStatement(n.body)];
        case "ForStatement":
            return [...(n.test ? handleExpression(n.test) : []), ...(n.update ? handleExpression(n.update) : []), ...handleStatement(n.body)];
        case "FunctionDeclaration":
            return [...(n.id ? [n.id.name] : []), ...handleBlock(n.body)];
        case "IfStatement":
            return [...handleExpression(n.test), ...handleStatement(n.consequent), ...(n.alternate ? handleStatement(n.alternate) : [])];
        case "LabeledStatement":
            return handleStatement(n.body);
        case "ReturnStatement":
            return [...(n.argument ? handleExpression(n.argument) : [])]
        case "SwitchStatement":
            return [...handleExpression(n.discriminant), ...n.cases.flatMap(c => [...handleExpression(c.test), ...c.consequent.flatMap(handleStatement)])]
        case "ThrowStatement":
            return handleExpression(n.argument);
        case "TryStatement":
            return [...handleBlock(n.block), ...handleBlock(n.handler?.body), ...handleBlock(n.finalizer)];
        case "WhileStatement":
            return [...handleExpression(n.test), ...handleStatement(n.body)];
        case "WithStatement":
            return [...handleExpression(n.object), ...handleStatement(n.body)];
        case "ClassDeclaration":
            return handleClass(n);
        case "ForOfStatement":
            return [...handleExpression(n.right), ...handleStatement(n.body)];
        case "VariableDeclaration":
            return n.declarations.flatMap(d => handleExpression(d.init));
        case "DebuggerStatement":
        case "BreakStatement":
        case "ContinueStatement":
        case "EmptyStatement":
        case "ExportAllDeclaration":
        case "ExportDefaultDeclaration":
        case "ExportNamedDeclaration":
        case "ImportDeclaration":
        case "DeclareClass":
        case "DeclareFunction":
        case "DeclareInterface":
        case "DeclareModule":
        case "DeclareModuleExports":
        case "DeclareTypeAlias":
        case "DeclareOpaqueType":
        case "DeclareVariable":
        case "DeclareExportDeclaration":
        case "DeclareExportAllDeclaration":
        case "InterfaceDeclaration":
        case "OpaqueType":
        case "TypeAlias":
        case "EnumDeclaration":
        case "TSDeclareFunction":
        case "TSInterfaceDeclaration":
        case "TSTypeAliasDeclaration":
        case "TSEnumDeclaration":
        case "TSModuleDeclaration":
        case "TSImportEqualsDeclaration":
        case "TSExportAssignment":
        case "TSNamespaceExportDeclaration":
        default:
            return [];
    }

}

function handleLVal(n: LVal): string[] {
    if ('name' in n) return [n.name];
    if('property'  in n) return getPropName(n.property);
    return [];
}

function handleUnaryLike(n: UnaryLike): string[] {
    return handleExpression(n.argument);
}

function handleClass(n: Class | ClassExpression): string[] {
    return n.body.body.flatMap(b => {
        switch (b.type) {
            case "ClassMethod":
                return [...getPropName(b.key), ...handleStatement(b.body)];
            case "ClassPrivateMethod":
                return [...getPropName(b.key), ...handleStatement(b.body)];
            case "ClassProperty":
                return [...getPropName(b.key), ...handleExpression(b.value)];
            case "ClassPrivateProperty":
                return [...getPropName(b.key), ...handleExpression(b.value)];
            case "TSIndexSignature":
            case "TSDeclareMethod":
                return [];
        }
    })
}

function handleBody(n:Program) {
    return n.body.flatMap(handleStatement);
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
        const asts = codes.map(code => parse(code));
        const names = asts.flatMap(ast => handleBody(ast.program));
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
