/**
 * --------------------------------------------------------------------------------------------
 * The requirement for an extension to be a decorator rather than an interface is
 * that decorators can only be implemented on certain command types (e.g. subcommands support).
 * whilst interfaces should affect commands, subcommands and groups.
 * --------------------------------------------------------------------------------------------
 */

export * from "./parent";
export * from "./executable";
export * from "./common";
export * from "./preconditions";
