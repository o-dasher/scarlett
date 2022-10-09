import {BaseCommand} from "../interfaces";
import {Collection} from "discord.js";
import {EmptyConstructor} from "../../types";

export class CommandExtensionMetadataHandler<M> {
	#metadataCollection = new Collection<Function, M>();
	
	public createMetadata(command: Function, create: () => M) {
		this.#metadataCollection.set(command, create());
	}
	
	public getMetadata(command: BaseCommand) {
		return this.#metadataCollection.get(command.constructor);
	}
}

export class NestedCommandExtensionMetadataHandler<N extends BaseCommand>
	extends CommandExtensionMetadataHandler<Collection<string, N>> {
	public createNestedMetadata(command: Function, constructors: EmptyConstructor<N>[]) {
		super.createMetadata(command, () => {
			const nestedMetadata = new Collection<string, N>();
			
			constructors.map(constructor => new constructor()).forEach(command => {
				nestedMetadata.set(command.name, command);
			});
			
			return nestedMetadata;
		});
	}
}