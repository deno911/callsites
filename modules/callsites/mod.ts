// deno-lint-ignore-file no-explicit-any
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
  getThis<T = unknown>(): T | undefined;

  /**
   * Returns the type of `this` as a string. This is the name of the function
   * stored in the `[[Constructor]]` field of `this`, if available. Otherwise
   * the object's `[[Class]]` internal property.
   */
  getTypeName(): string | null;

  /**
   * Returns the name of the script if this function was defined in a script.
   *
   * In the Deno runtime, this can be used to determine the `import.meta.url`
   * value of the end user's project, which is useful when authoring modules
   * that will be imported remotely.
   */
  getFileName(): string | null;

  /**
   * Returns a reference to the current function itself, if available, else it
   * returns `undefined`.
   */
  getFunction<T extends AnyFunction = AnyFunction>(): T | undefined;

  /**
   * Returns the name of the current function (typically its `name` property).
   * If the `name` property is not available, an attempt will be made to infer
   * a name from the function's context. If a name still can't be determined,
   * returns `null`.
   */
  getFunctionName(): string | null;

  /**
   * Returns the name of the property of `this` or one of its prototypes that
   * holds the current function.
   */
  getMethodName(): string | undefined;

  /**
   * Returns the line number of the callsite function, if it was defined in a
   * script. If the line number cannot be determined, returns `null`.
   */
  getLineNumber(): number | null;

  /**
   * Returns the column number of the callsite function, if it was defined in a
   * script. If the column number cannot be determined, returns `null`.
   */
  getColumnNumber(): number | null;

  /**
   * Get the line number of the function's enclosing callsite, if available.
   * Otherwise, returns `null`.
   */
  getEnclosingLineNumber(): number | null;

  /**
   * Get the column number of the function's enclosing callsite, if available.
   * Otherwise, returns `null`.
   */
  getEnclosingColumnNumber(): number | null;

  /**
   * Returns a string representing the location where `eval` was called if this
   * function was created using a call to `eval`. If it was not created with
   * `eval` or `new Function`, or it cannot be determined, returns `undefined`.
   *
   * @see {@linkcode CallSite.isEval} to check if a function was created using `eval` or `new Function`.
   */
  getEvalOrigin(): string | undefined;

  /**
   * Returns the first line of the function's body if this function was
   * defined in a script. If it cannot be determined, returns `null`.
   */
  getPosition(): number | null;

  /**
   * Determine the execution index from an asynchronous call site, if it was
   * invoked by an async call to `Promise.all()` or `Promise.any()`.
   *
   * Returns the numeric index of the Promise, when the call originates from
   * an invocation of `Promise.all` or `Promise.any`. Otherwise, returns `null`.
   *
   * @see {@link CallSite.isAsync} to check for _any_ async call.
   * @see {@link CallSite.isPromiseAll} to check for `Promise.all` calls.
   * @async
   */
  getPromiseIndex(): number | null;

  /**
   * Returns the hash of the script if this function was defined in an
   * embedded `data:` URI.
   */
  getScriptHash(): string | null;

  /**
   * If the call site function was defined in a script, returns the name of the
   * script itself. If the function was defined remotely or in a base64-encoded
   * data URI, this will attempt to return the source URL. If a value cannot be
   * determined, returns an empty string (`""`).
   *
   * @see {@link CallSite.getScriptHash} to get an encoded script hash.
   */
  getScriptNameOrSourceURL(): string;

  /**
   * Determine if a call is from an async function (including `Promise.all`
   * and `Promise.any`), using V8's shiny new zero-cost async-stack-trace API.
   *
   * Returns `true` if this is tracing an async call, otherwise `false`.
   *
   * @see {@link CallSite.isPromiseAll} to check for `Promise.all` calls.
   * @see {@link CallSite.getPromiseIndex} to get the index of the Promise call
   * @async
   */
  isAsync(): boolean;

  /**
   * Is the call from a class constructor or a "newable" function?
   *
   * Returns `true` if the call site originated with `new`, otherwise `false`.
   */
  isConstructor(): boolean;

  /**
   * Returns `true` if this call takes place in code defined by a call to
   * `eval`, or if it was constructed using `new Function(...)` syntax.
   * Otherwise, returns `false`.
   *
   * @see {@link CallSite.getEvalOrigin} to get the source location of an `eval` call.
   */
  isEval(): boolean;

  /**
   * Does this call originate from native V8 code? This resolves to `true` for
   * invocations of any built-in functions, such as `Array.prototype.push()`.
   *
   * Returns `true` if this call is in native V8 code.
   */
  isNative(): boolean;

  /**
   * Is this an async call to `Promise.all()`?
   *
   * Returns `true` if this is an asynchronous call to `Promise.all`. Returns
   * `false` for everything else, even if it **_is async_**, but **_is not_**
   * explicitly from `Promise.all()`.
   *
   * @see {@link CallSite.isAsync} to check for _any_ async call.
   * @see {@link CallSite.getPromiseIndex} to get the index of the Promise call
   * @async
   */
  isPromiseAll(): boolean;

  /**
   * Returns `true` if this is a top-level invocation; top-level means an
   * object is either a global object, or is invoked at the outermost layer of
   * a script or module (and not nested inside another function / block).
   */
  isToplevel(): boolean;

  /**
   * Serializes the call site into a string, suitable for a stack trace entry.
   *
   * The format of the serialized string is:
   * ```
   * [TypeName.]MethodName (FileName:LineNumber:ColumnNumber)
   * ```
   *
   * **Note**: While this can be used directly, it is primarily intended as a
   * helper for the `Error.prepareStackTrace` API.
   *
   * @example Object.foo (file:///Users/foo/bar.ts:1:1)
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

type ResolvedCallSiteType = Required<
  {
    [K in keyof CallSite as K extends "constructor" | symbol ? never : K]-?:
      CallSite[K] extends (...args: any) => infer R ? R : never;
  }
>;

/**
 * Represents a CallSite stack trace entry that has been resolved into a static
 * object. The resolved CallSite has a very similar shape to {@link CallSite},
 * with all methods resolved to fields containing their return values.
 *
 * The resolved object is more suitable for serializing via `JSON.stringify`.
 *
 * @see {@link callsites.resolved} to use this at runtime.
 * @example
 * ```ts
 * import { callsites } from "https://deno.land/x/callsites/mod.ts";
 *
 * function foo() {
 *   console.log(JSON.stringify(callsites.resolved()[0]));
 * }
 * foo();
 *
 * // => {"getThis":"undefined","getTypeName":"..."}
 * ```
 */
// deno-lint-ignore no-empty-interface
export interface ResolvedCallSite extends ResolvedCallSiteType {}

/**
 * Augment the global namespace to include the stack trace API.
 * (in case the user's environment doesn't already have it)
 * @see https://v8.dev/docs/stack-trace-api
 */
declare global {
  interface ErrorConstructor {
    /**
     * Create `.stack` property on a target object.
     */
    // deno-lint-ignore ban-types
    captureStackTrace(targetObject: object, constructor?: Function): void;
    /**
     * Optional override for formatting stack traces
     * @see https://v8.dev/docs/stack-trace-api#customizing-stack-traces
     */
    prepareStackTrace?<T = unknown>(err: Error, stackTraces: CallSite[]): T;
    /**
     * Override the maximum number of stack trace entries.
     * @default 10
     */
    stackTraceLimit: number;
  }
}

/**
 * @returns an array of CallSite objects using the V8 stack trace API.
 * @see {@link CallSite} for available methods on the return call site objects.
 * @see {@link callsites.resolved} for a serialization-friendly version
 *
 * Determining the filename of the calling function:
 *
 * @example
 * ```ts
 * import { callsites } from "https://deno.land/x/callsites/mod.ts";
 *
 * function fileName() {
 *   return callsites()[0].getFileName();
 * }
 *
 * console.log(fileName());
 * // => file:///path/to/file.js
 * ```
 *
 * Using the async-stack-trace API:
 *
 * @example
 * ```ts
 * import { callsites } from "https://deno.land/x/callsites/mod.ts";
 *
 * async function foo() {
 *   const site = callsites()[0];
 *
 *   return {
 *     isAsync: site.isAsync(),
 *     isPromiseAll: site.isPromiseAll(),
 *     getPromiseIndex: site.getPromiseIndex(),
 *   };
 * }
 *
 * console.log(await foo());
 * // { isAsync: true, isPromiseAll: false, getPromiseIndex: null }
 *
 * console.log(await Promise.all([foo, foo]));
 * // [
 * //   { isAsync: true, isPromiseAll: true, getPromiseIndex: 0 },
 * //   { isAsync: true, isPromiseAll: true, getPromiseIndex: 1 },
 * // ]
 * ```
 */
export function callsites(): CallSite[];

/**
 * Control the formatting of the call site objects by providing a custom
 * `prepareStackTrace` function. It accepts two arguments: the `Error` object,
 * and the `CallSite[]` stack.
 *
 * @param prepareStackTrace Provide a custom prepareStackTrace function to control the formatting of the callsites output.
 * @returns an array of items with the return type of the `prepareStackTrace` function
 */
export function callsites<U>(
  prepareStackTrace: (error: Error, stack: CallSite[]) => U,
): U;

export function callsites<U = CallSite>(
  prepareStackTrace: (e: Error, s: CallSite[]) => U = (_, stack) => stack as U,
): U {
  if (prepareStackTrace != null && typeof prepareStackTrace !== "function") {
    throw new TypeError(
      `callsites expected a function for \`prepareStackTrace\`. Received: ${typeof prepareStackTrace}`,
    );
  } else {
    // default behavior is to return the raw stack of CallSite objects.
    prepareStackTrace = prepareStackTrace || ((_, stack) => stack as U);
  }

  const existingStackTraceLimit = Error.stackTraceLimit;

  // store the existing Error.prepareStackTrace function
  const existingPrepareStackTrace = Error.prepareStackTrace;

  // set the stack trace limit to the maximum
  Error.stackTraceLimit = Infinity;

  // replace with our own prepareStackTrace function
  Error.prepareStackTrace = prepareStackTrace as any;

  // create a new Error instance to capture the stack
  const err = {} as { stack: CallSite[] };
  Error.captureStackTrace(err, callsites);

  // extract the stack (this is the most important part)
  const stack = err?.stack?.slice?.();

  // restore the function to its prior state to cover our tracks
  // Note that .stack is a lazy accessor, so we **must** access property before
  // replacing the old function; otherwise our handler would be ignored.
  Error.prepareStackTrace = existingPrepareStackTrace;

  // restore the stack trace limit
  Error.stackTraceLimit = existingStackTraceLimit;

  // return the stack
  return stack as U;
}

/**
 * Returns an array of {@linkcode ResolvedCallSite} objects, using V8's stack
 * trace API. Each of the returned objects is the same as a regular call to
 * {@linkcode callsites}, but with each method evaluated and replaced with
 * its return value. This makes it quite simple to serialize and debug.
 *
 * Determine the filename of the calling function:
 * @example
 * ```ts
 * import { callsites } from "https://deno.land/x/callsites/mod.ts";
 *
 * function fileName() {
 *   return callsites.resolved()[0].getFileName;
 * }
 *
 * console.log(fileName());
 * // => file:///path/to/file.js
 * ```
 *
 * Using the async-stack-trace API:
 * @example
 * ```ts
 * import { callsites } from "https://deno.land/x/callsites/mod.ts";
 *
 * async function foo() {
 *   const [{ isAsync, isPromiseAll, getPromiseIndex }] = callsites.resolved();
 *   return { isAsync, isPromiseAll, getPromiseIndex };
 * }
 *
 * console.log(await foo());
 * // { isAsync: true, isPromiseAll: false, getPromiseIndex: null }
 *
 * console.log(await Promise.all([foo, foo]));
 * // [
 * //   { isAsync: true, isPromiseAll: true, getPromiseIndex: 0 },
 * //   { isAsync: true, isPromiseAll: true, getPromiseIndex: 1 },
 * // ]
 * ```
 * @module callsites
 */
callsites.resolved = () =>
  callsites((_, stack) =>
    stack.map((site) => {
      const proto = (site as any).constructor.prototype as CallSite;
      const properties = Object.getOwnPropertyNames(proto).filter((k) => (
        "constructor" !== k &&
        "function" === typeof site[k as keyof typeof site]
      ));

      return properties.reduce(
        (o, k) => {
          const v = site[k as keyof typeof site];
          if (typeof v === "function") (o as any)[k] = v.call(site);
          return o;
        },
        {} as ResolvedCallSite,
      );
    })
  ).slice(1);

const { resolved } = callsites;

export { callsites as default, resolved as resolvedCallsites };

/*!
The MIT License (MIT)

Copyright © 2023 Nicholas Berlette (https://github.com/nberlette)
Copyright © 2022 Yoshiya Hinosawa (https://github.com/kt3k)
Copyright © 2018-2021 Sindre Sorhus (https://github.com/sindresorhus)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
