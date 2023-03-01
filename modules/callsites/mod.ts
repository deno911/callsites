// Copyright 2023 Nicholas Berlette. All rights reserved. MIT license.
// Copyright 2022 Yoshiya Hinosawa. All rights reserved. MIT license.
// Copyright 2018-2021 Sindre Sorhus. All rights reserved. MIT license.

// deno-lint-ignore no-explicit-any
type AnyFunction = (...args: any[]) => any;

/**
 * An object representing a call site, such as a function call, in V8.
 * @see https://v8.dev/docs/stack-trace-api#customizing-stack-traces
 */
export interface CallSite {
  /**
   * Returns the **value** of `this` - if it exists - as a string. Otherwise,
   * returns `undefined`.
   */
  getThis(): unknown | undefined;
  
  /**
   * Returns the type of `this` as a string. This is the name of the function
   * stored in the `[[Constructor]]` field of `this`, if available. Otherwise
   * the object's `[[Class]]` internal property.
   */
  getTypeName(): string | null;
  
  /**
   * Returns a reference to the current function itself (if available).
   */
  getFunction(): Function | undefined;
  
  /**
   * Returns the name of the current function (typically its `name` property).
   * If the `name` property is not available, an attempt will be made to infer
   * a name from the function's context.
   */
  getFunctionName(): string | null;
  
  /**
   * Returns the name of the property of `this` or one of its prototypes that
   * holds the current function.
   */
  getMethodName(): string | undefined;
  
  /**
   * Returns the name of the script if this function was defined in a script. 
   */
  getFileName(): string | null;
  
  /**
   * Returns current line number if this function was defined in a script.
   */
  getLineNumber(): number | null;
  
  /**
   * Returns current column number if the function was defined in a script.
   */
  getColumnNumber(): number | null;
  
  /**
   * Get the column of the function's enclosing call site, if available.
   */
  getEnclosingColumnNumber(): number | null;
  
  /**
   * Get the line number of the function's enclosing call site, if available.
   */
  getEnclosingLineNumber(): number | null;
  
  /**
   * Returns the script name of the script if this function was defined in a
   * script, or the source URL if this function was defined in a remote source.
   */
  getScriptNameOrSourceURL(): string | null;
  
  /**
   * Returns the hash of the script if this function was defined in an
   * embedded `data:` URI.
   */
  getScriptHash(): string | null;
  
  /**
   * Returns the first line of the function's body if this function was
   * defined in a script.
   */
  getPosition(): number | null;
  
  /**
   * Returns a string representing the location where `eval` was called if this
   * function was created using a call to `eval`.
   */
  getEvalOrigin(): string | undefined;
  
  /**
   * Returns `true` if this is a top-level invocation; top-level means an
   * object is either a global object, or is invoked at the outermost layer of
   * a script or module (and not nested inside another function / block).
   */
  isToplevel(): boolean;
  
  /**
   * Returns `true` if this call takes place in code defined by a call to
   * `eval`, or using the `Function` constructor (`new Function(...)`) syntax.
   */
  isEval(): boolean;
  
  /**
   * Returns `true` if this call is in native V8 code.
   */
  isNative(): boolean;

  /**
   * Returns `true` if this is a constructor call.
   */
  isConstructor(): boolean;

  /**
   * Is this an async call (i.e. await, Promise.all() or Promise.any())?
   *
   * @returns `true` if this is tracing an async call, otherwise `false`. Uses the shiny new V8 async stack trace API (at purportedly zero-cost).
   *
   * @see {@link CallSite.isPromiseAll} to check for `Promise.all()` calls.
   * @see {@link CallSite.getPromiseIndex} to get the index of the Promise call
   * @async
   */
  isAsync(): boolean;

  /**
   * Is this an async call to `Promise.all()`?
   * @returns `true` if this is tracing an async call to `Promise.all()`. 
   * @returns `false` if it is not an async trace of `Promise.all()`, even if it **_is_** async but **_is not_** tracing a `Promise.all()` invocation.
   * @see {@link CallSite.isAsync} to check for _any_ async call.
   * @see {@link CallSite.getPromiseIndex} to get the index of the Promise call   * 
   */
  isPromiseAll(): boolean;

  /**
   * Determine the execution index from an asynchronous CallSite, if it was
   * invoked by an async call to `Promise.all` or `Promise.any`.
   *
   * @returns (for async traces) the numeric index of the Promise followed in a call to either `Promise.all()` or `Promise.any()`. If the CallSite is **_not_** an async `Promise.all` or `Promise.any` call, returns `null`.
   *
   * @see {@link CallSite.isAsync} to check for _any_ async call.
   * @see {@link CallSite.isPromiseAll} to check for `Promise.all()` calls.
   * @async
   */
  getPromiseIndex(): number | null;

  /**
   * Serializes the CallSite into a string, suitable for a stack trace.
   *
   * Returns a string representation of this call site
   * @remarks
   * While this can be used directly, it is primarily intended as a helper for
   * the `Error.prepareStackTrace` API. Each CallSite is represented like this:
   * ```
   * [TypeName.]MethodName (FileName:LineNumber:ColumnNumber)
   * ```
   *
   * @example  Object.foo (file:///Users/foo/bar.ts:1:1)
   * @example
   * ```ts
   * import { callsites } from "./mod.ts";
   *
   * function foo() {
   *   console.log(callsites()[0].toString());
   *   console.log(callsites()[0] + "");
   *   console.log(`${callsites()[0]}`);
   *   console.log(String(callsites()[0]));
   *
   *   // all the above output the same string:
   *   // foo (file:///Users/foo/bar.ts:1:1)
   * }
   * foo();
   * ```
   */
  toString(): string;
}

/**
 * @returns an array of {@linkcode CallSite} objects
 * @example
 * ```ts
 * import callsites from "https://deno.land/x/callsites/mod.ts";
 * function foo() {
 *   console.log(callsites()[0].getFileName());
 *   // => file:///path/to/file.js
 * }
 * foo();
 * ```
 */
// deno-lint-ignore no-explicit-any
export function callsites(): CallSite[] {
  const _prepareStackTrace = (Error as any).prepareStackTrace;
  (Error as any).prepareStackTrace = (_: unknown, stack: CallSite) => stack;
  const stack = (new Error() as any).stack.slice(1);
  (Error as any).prepareStackTrace = _prepareStackTrace;
  return stack;
}

export default callsites;