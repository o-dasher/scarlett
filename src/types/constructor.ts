export type Constructor<A extends unknown[], T> = {
	new(...args: A): T;
	prototype: T;
};

export type EmptyConstructor<T> = Constructor<[], T>;