# callsites

Deno utility to retrieve call sites information from the [V8 stack trace API](https://v8.dev/docs/stack-trace-api).

Features zero-cost async-stack-trace methods `isAsync`, `isPromiseAll`, and `getPromiseIndex`.

## Usage

```ts
import { callsites } from "https://deno.land/x/callsites/mod.ts";
```

```ts
const sites = () => callsites();
console.log(sites()[0].getFileName());
// => Returns the filename of this file

export function foo() {
  const sites = callsites();
  console.log(sites[1].getFileName());
  // => returns the filename of the caller of this function.
}
```

The latter example is useful for getting the information about the caller of your function.

<br>

## How it works

The `callsites` logic is pretty straightforward:
  1. reference the existing global `Error.prepareStackTrace` handler
  2. temporarily replace it with our own `prepareStackTrace` handler
  3. create a new `Error` object , extract its `stack` property
  4. restore `Error.prepareStackTrace` to its original state
  5. return the `stack`, an array of unformatted `CallSite` objects.

<br>

# API

## 🄵 <a id="callsites-function" href="#callsites-function" title="callsites (function)"><code><u>callsites</u>()</code></a>

Exported by default and by name (as `callsites`), this function is used to get  
the internal stacktrace data before it is serialized into a string.   

Returns an array of [`CallSite` objects](#callsite) by default. 

```ts
callsites(): CallSite[];
```

### Using your own `prepareStackTrace` function

You can provide `callsites` with a custom handler function to control the stack trace formatting. 

```ts
callsites((err: Error, stack: CallSite[]) => {
  return stack; // this is the default behavior
})
```

An example of this feature can be seen in action with the [`callsites.resolved()`](#callsites-resolved) function.

## 🄸 <a id="callsite-interface" href="#callsite-interface" title="CallSite (interface)"><code>CallSite</code></a>

`CallSite` inherits all the methods found in `NodeJS.CallSite`, adding various  
improvements to some of the types along the way. For example, overloading  
the [`getThis()`](#getthis) method that has a generic type parameter, allowing stronger  
types when the contextual `this` object's shape is known in advance.

<br>

### `getThis`

Returns the value of the `this` object the call site is bound to, if it exists. Otherwise, returns `undefined`.

```ts
getThis(): unknown | undefined;

// generic overload to specify the `this` type
getThis<T = unknown>(): T | undefined;
```

--- 

### `getTypeName`

Returns the type of `this` as a string.  

This is the **name** of the function stored in the constructor field of `this`. If unavailable, falls back to the object's internal `[[Class]]` property. If a TypeName can't be resolved, returns `null`.

```ts
getTypeName(): string | null;
```

---  

### `getFunction`

Returns the function itself, or `undefined` if the call site function cannot be resolved.

```ts
getFunction(): Function | undefined;

// generic overload to specify a type that is narrower than "Function":
getFunction<T extends (...args: any) => any>(): T | undefined.
```

---  

### `getFunctionName`

Returns the name of the callee function, typically its `name` property.
If the name property is missing or empty (as is often the case with arrow functions), 
attempts to infer a name from the function's context. 
If no name can be determined, this will resolve to `null`.

```ts
getFunctionName(): string | null;
```

---  

### `getMethodName`

If the call site function is a method of an enclosing class or object, this will return the property 
name of the `this` object (or one of its prototypes) that contains the actual function. 
If a name can't determined, returns `undefined`.  

```ts
getMethodName(): string | undefined;
```

---  

### `getFileName`

If the function was defined in a script, returns the script resolved filename.

Returns the name of the script if this function was defined in a script, or `null` if a filename cannot be determined.

```ts
getFileName(): string | null;
```

---  

### `getLineNumber`

If the function was defined in a script, returns the line number in that script where the call occurred.  
Otherwise, returns `null`.

```ts
getLineNumber(): number | null;
```

---  

### `getColumnNumber`

If the function was defined in a script, returns the column number in that script where the call occurred.  
Otherwise, returns `null`.

```ts
getColumnNumber(): number | null;
```

---  

### `getEvalOrigin`

If the function was created in a call to `eval`, returns a string representing the location where `eval` was called.  
Otherwise, returns `null`.

```ts
getEvalOrigin(): string | null;
```

---  


### 🆕 `isAsync`

Returns a `boolean` value to indicate whether or not this an asynchronous call. You can use the [`isPromiseAll`](#🆕-ispromiseall) method to further determine of the call was explicitly from a `Promise.all()` invocation.

```ts
isAsync(): boolean;
```

---  

### 🆕 `isPromiseAll`

Returns a `boolean` value to indicate that the call originated from an async  
invocation via `Promise.all()`. When this is `true`, you can also expect the  
method `getPromiseIndex` to return the called function's index in the array  
of promises that was provided to `Promise.all()` at runtime.

```ts
isPromiseAll(): boolean;
```

---  

### 🆕 `getPromiseIndex`

If the call originated from `Promise.any()` or `Promise.all()`, this method  
will get the index of the called function in the array of promises.

```ts
getPromiseIndex(): number | null;
```

---

### `isToplevel`

Is this a top-level invocation, that is, is this the global object?

```ts
isToplevel(): boolean;
```

---  

### `isEval`

Does this call take place in code defined by a call to `eval`?

```ts
isEval(): boolean;
```

---  

### `isNative`

Is this call in native V8 code?

```ts
isNative(): boolean;
```

---  

### `isConstructor`

Is this a constructor call?

```ts
isConstructor(): boolean;
```

<br>

## 🄵 <a id="callsites-resolved" href="#callsites-resolved" title="callsites.resolved (function)"><code>callsites.resolved()</code></a>

Available as a method of the main [`callsites`](#callsites) export for convenience, or by the named export `callsitesResolved`, this function evaluates all the callsite methods, replacing them with their resolved values. Internally it relies on the [custom `prepareStackTrace` feature](#using-your-own-preparestacktrace-function) of the `callsites` function to apply its own formatting logic to each `CallSite` object in the stack.

The objects returned from this function have their own interface called `ResolvedCallSite`.

```ts
callsites.resolved(): ResolvedCallSite[];
```

<br>

---  

## License

MIT © Nicholas Berlette. Based on [kt3k/callsites](https://github.com/kt3k/callsites) and [sindresorhus/callsites](https://github.com/sindresorhus/callsites). All rights Reserved. 