export type RequiredLimitedCallArgs = {
	maxCalls: number,
	onCalledTooManyTimes: (args: ListenerArgs) => void
}

export type ListenerArgs = {
	targetName: string,
	propertyName: string,
	args: RequiredLimitedCallArgs
}

export type PartialLimitedCallArgs = Partial<RequiredLimitedCallArgs>

const callablesCallCountMap = new Map<string, number>();

export const LimitedCalls = (args: PartialLimitedCallArgs = {}) => {
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
				args: args as RequiredLimitedCallArgs
			});
		}
		
		return caller;
	};
};
