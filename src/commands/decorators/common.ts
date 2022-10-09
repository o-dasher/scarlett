import {BaseCommand} from "../interfaces";
import {Collection} from "discord.js";
import {SubCommandGroup} from "../impl";
import {Constructor, EmptyConstructor} from "../../types";

export class CommandExtensionMetadataHandler<C extends BaseCommand, M> {
	#metadataCollection = new Collection<C, M>();
	
	public createMetadata(command: C, create: () => M) {
		this.#metadataCollection.set(command, create());
	}
	
	public getMetadata(command: C) {
		return this.#metadataCollection.get(command);
	}
}

export class NestedCommandExtensionMetadataHandler<C extends BaseCommand, N extends BaseCommand>
	extends CommandExtensionMetadataHandler<C, Collection<string, N>> {
	public createNestedMetadata(command: C, constructors: EmptyConstructor<N>[]) {
		super.createMetadata(command, () => {
			const nestedMetadata = new Collection<string, N>();
			
			constructors.map(constructor => new constructor()).forEach(command => {
				nestedMetadata.set(command.name, command);
			});
			
			return nestedMetadata;
		});
	}
}