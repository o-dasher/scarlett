export type Constructor<A extends unknown[], T> = {
	new(...args: A): T;
	prototype: T;
};

export type EmptyConstructor<T> = Constructor<[], T>;

const handler = {
	"construct": () => handler
};

export const isConstructor = (object: any) => {
	try {
		return !!(new (new Proxy(object, handler)));
	} catch {
		return false;
	}
};