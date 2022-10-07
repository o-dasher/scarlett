type ConstructorType<TArgs extends unknown[], T> = {
	new(...args: TArgs): T;
	prototype: T;
};
