export type TLimitedCallsArgsRequired = {
	maxCalls: number,
	onCalledTooManyTimes: (args: TListenerArgs) => void
}

export type TListenerArgs = {
	targetName: string,
	propertyName: string,
	args: TLimitedCallsArgsRequired
}

export type TLimitedCallsArgs = Partial<TLimitedCallsArgsRequired>

const callablesCallCountMap = new Map<string, number>();

export const LimitedCalls = (args: TLimitedCallsArgs = {}) => {
	args.maxCalls ??= 1;
	args.onCalledTooManyTimes ??= () => {
	};
	
	const {maxCalls, onCalledTooManyTimes} = args;
	
	return <T extends object>(
		target: T,
		name: keyof T,
		descriptor: PropertyDescriptor
	) => {
		const key = target.toString() + name.toString();
		const calledTimes = (callablesCallCountMap.get(key) ?? 0) + 1;
		
		callablesCallCountMap.set(key, calledTimes);
		
		let caller = descriptor.value;
		
		if (calledTimes > maxCalls) {
			Object.defineProperty(this, name, {
				value: caller = () => {
				},
				configurable: true,
				writable: true,
			});
			onCalledTooManyTimes({
				targetName: Object.getPrototypeOf(target).name,
				propertyName: name.toString(),
				args: args as TLimitedCallsArgsRequired
			});
		}
		
		return caller;
	};
};