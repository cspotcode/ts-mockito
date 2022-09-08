---
id: k5x1e
name: Creating a Matcher
file_version: 1.0.2
app_version: 0.9.5-5
file_blobs:
  src/ts-mockito.ts: 5b37677dc259dfebf8cdf34152a39b64a7378f03
  src/matcher/type/AnyFunctionMatcher.ts: bf9a1b9a30a5737fdadc8ed9c52ac31bc6570b85
  src/matcher/type/Matcher.ts: 87bbc83446c8257867b24f0a6b0ff77847ac249d
  src/matcher/type/DeepEqualMatcher.ts: b2a98862733d99761f90f0307fc715483d865843
  src/matcher/type/MatchingStringMatcher.ts: 28065005f9b4749b92eb8630eab86b39e6dccd21
  src/matcher/type/AnythingMatcher.ts: b273ced7f839af0c6dcd0b0df1064477b3e59fc3
---

Understanding Matchers, how they work, and how to add new ones, is important - and this document will describe just that.

A Matcher is {Explain what a Matcher is and its role in the system}

Some examples of `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV)s are `DeepEqualMatcher`[<sup id="O9BEc">↓</sup>](#f-O9BEc), `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN), `MatchingStringMatcher`[<sup id="1iXXiA">↓</sup>](#f-1iXXiA), and `AnythingMatcher`[<sup id="2jEIh9">↓</sup>](#f-2jEIh9).

## TL;DR - How to Add a `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV)

1.  Create a new class inheriting from `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV) 
    
    *   Place the file under `📄 src/matcher/type`, e.g. `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN) is defined in `📄 src/matcher/type/AnyFunctionMatcher.ts`.
        
2.  Implement `match`[<sup id="cCO2w">↓</sup>](#f-cCO2w), `toString`[<sup id="ZlCaNS">↓</sup>](#f-ZlCaNS), and `constructor`[<sup id="Z2meJ2e">↓</sup>](#f-Z2meJ2e).
    
3.  Update `📄 src/ts-mockito.ts`.
    
4.  **Profit** 💰
    

## Example Walkthrough - `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN)

We'll follow the implementation of `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN) for this example.

An `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN) is {Explain what AnyFunctionMatcher is and how it works with the Matcher interface}

<br/>

### `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN) Usage Example

For example, this is how `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN) can be used:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/ts-mockito.ts
```typescript
⬜ 86     }
⬜ 87     
⬜ 88     export function anyFunction(): any {
🟩 89         return new AnyFunctionMatcher() as any;
⬜ 90     }
⬜ 91     
⬜ 92     export function anyNumber(): any {
```

<br/>

## Steps to Adding a new `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV)

### 1\. Inherit from `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV).

All `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV)s are defined in files under `📄 src/matcher/type`.

<br/>

We first need to define our class in the relevant file, and inherit from `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV):
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/matcher/type/AnyFunctionMatcher.ts
```typescript
⬜ 1      import * as _ from "lodash";
⬜ 2      import {Matcher} from "./Matcher";
⬜ 3      
🟩 4      export class AnyFunctionMatcher extends Matcher {
⬜ 5          constructor() {
⬜ 6              super();
⬜ 7          }
```

<br/>

> **Note**: the class name should end with "Matcher".

### 2\. Implement `match`[<sup id="cCO2w">↓</sup>](#f-cCO2w), `toString`[<sup id="ZlCaNS">↓</sup>](#f-ZlCaNS), and `constructor`[<sup id="Z2meJ2e">↓</sup>](#f-Z2meJ2e)

Here is how we do it for `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN):

<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/matcher/type/AnyFunctionMatcher.ts
```typescript
⬜ 6              super();
⬜ 7          }
⬜ 8      
🟩 9          public match(value: any): boolean {
⬜ 10             return _.isFunction(value);
⬜ 11         }
⬜ 12     
```

<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/matcher/type/AnyFunctionMatcher.ts
```typescript
⬜ 10             return _.isFunction(value);
⬜ 11         }
⬜ 12     
🟩 13         public toString(): string {
⬜ 14             return "anyFunction()";
⬜ 15         }
⬜ 16     }
```

<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/matcher/type/AnyFunctionMatcher.ts
```typescript
⬜ 2      import {Matcher} from "./Matcher";
⬜ 3      
⬜ 4      export class AnyFunctionMatcher extends Matcher {
🟩 5          constructor() {
⬜ 6              super();
⬜ 7          }
⬜ 8      
```

<br/>

## Update `📄 src/ts-mockito.ts`

Every time we add new `Matcher`[<sup id="1S1UgV">↓</sup>](#f-1S1UgV)s, we reference them in `📄 src/ts-mockito.ts`.

We will still look at `AnyFunctionMatcher`[<sup id="Z1qIRzN">↓</sup>](#f-Z1qIRzN) as our example.

<br/>



<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/ts-mockito.ts
```typescript
⬜ 86     }
⬜ 87     
⬜ 88     export function anyFunction(): any {
🟩 89         return new AnyFunctionMatcher() as any;
⬜ 90     }
⬜ 91     
⬜ 92     export function anyNumber(): any {
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-Z1qIRzN">AnyFunctionMatcher</span>[^](#Z1qIRzN) - "src/matcher/type/AnyFunctionMatcher.ts" L4
```typescript
export class AnyFunctionMatcher extends Matcher {
```

<span id="f-2jEIh9">AnythingMatcher</span>[^](#2jEIh9) - "src/matcher/type/AnythingMatcher.ts" L3
```typescript
export class AnythingMatcher extends Matcher {
```

<span id="f-Z2meJ2e">constructor</span>[^](#Z2meJ2e) - "src/matcher/type/AnyFunctionMatcher.ts" L5
```typescript
    constructor() {
```

<span id="f-O9BEc">DeepEqualMatcher</span>[^](#O9BEc) - "src/matcher/type/DeepEqualMatcher.ts" L4
```typescript
export class DeepEqualMatcher<T> extends Matcher {
```

<span id="f-cCO2w">match</span>[^](#cCO2w) - "src/matcher/type/AnyFunctionMatcher.ts" L9
```typescript
    public match(value: any): boolean {
```

<span id="f-1S1UgV">Matcher</span>[^](#1S1UgV) - "src/matcher/type/Matcher.ts" L1
```typescript
export class Matcher {
```

<span id="f-1iXXiA">MatchingStringMatcher</span>[^](#1iXXiA) - "src/matcher/type/MatchingStringMatcher.ts" L3
```typescript
export class MatchingStringMatcher extends Matcher {
```

<span id="f-ZlCaNS">toString</span>[^](#ZlCaNS) - "src/matcher/type/AnyFunctionMatcher.ts" L13
```typescript
    public toString(): string {
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBdHMtbW9ja2l0byUzQSUzQVR5cGVTdHJvbmc=/docs/k5x1e).