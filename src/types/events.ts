import {EventEmitter} from "events";

export type Event<A extends unknown[] = []> = {
	name: string;
	args: A;
};

export type NewEvent<N extends string, A extends unknown[] = []> = {
	name: N;
	args: A;
} & Event<A>;

export class TypedEventEmitter<E extends Event<unknown[]>[]> extends EventEmitter {
	public override emit<T extends E[number]>(
		eventName: T["name"],
		...args: T["args"]
	): boolean {
		return super.emit(eventName, args);
	}
	
	public override on<T extends E[number]>(
		eventName: T["name"],
		listener: (...args: T["args"]) => void
	): this {
		return super.on(eventName, listener);
	}
	
	public override once<T extends E[number]>(
		eventName: T["name"],
		listener: (...args: T["args"]) => void
	): this {
		return super.once(eventName, listener);
	}
}