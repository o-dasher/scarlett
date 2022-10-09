import {BaseCommand} from "../../interfaces";
import {CommandInteraction} from "discord.js";
import {EmptyConstructor} from "../../../types";
import {CommandExtensionMetadataHandler} from "../common";

const commandPreconditionsMetadataHandler = new CommandExtensionMetadataHandler<Precondition[]>();

export const getCommandPreconditions = commandPreconditionsMetadataHandler.getMetadata;

export abstract class Precondition {
	abstract verify(interaction: CommandInteraction): boolean;
}

export const WithPreconditions = (preconditions: (typeof Precondition | Precondition)[]) => {
	return (target: EmptyConstructor<BaseCommand>) => {
		commandPreconditionsMetadataHandler.createMetadata(target, () => preconditions.map(precondition =>
			typeof precondition == "function" ? new (precondition as EmptyConstructor<Precondition>)() : precondition)
		);
	};
};