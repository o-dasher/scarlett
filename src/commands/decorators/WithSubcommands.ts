import {Collection} from "discord.js";
import {IScarlettCommandWithSubCommands} from "../interfaces";
import {ConstructorType} from "../../types";
import {TAnyScarlettSubCommand} from "../ScarlettSubcommand";
import {getCommandDescriptor} from "./CommandDescriptor";

const subcommandsCollection = new Collection<IScarlettCommandWithSubCommands, Collection<string, TAnyScarlettSubCommand>>();

export const getSubcommands = subcommandsCollection.get;

export const WithSubcommands = (subCommands: ConstructorType<[], TAnyScarlettSubCommand>[]) =>
	(target: IScarlettCommandWithSubCommands) => {
		const subCommandsForCommandsCollection = new Collection<string, TAnyScarlettSubCommand>();
		
		subCommands.map(subcommand => new subcommand()).map(subcommand => {
			const descriptor = getCommandDescriptor(subcommand);
			
			if (!descriptor) return;
			
			subCommandsForCommandsCollection.set(descriptor.name, subcommand);
		});
		
		subcommandsCollection.set(target, subCommandsForCommandsCollection);
	};