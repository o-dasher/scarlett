import {Collection} from "discord.js";
import {IScarlettCommandWithSubCommands} from "../interfaces";
import {ConstructorType} from "../../types";
import {ScarlettSubcommand, TAnyScarlettSubCommand} from "../ScarlettSubcommand";
import {getCommandDescriptor} from "./CommandDescriptor";
import {ScarletSubcommandGroup} from "../ScarletSubcommandGroup";

const subcommandsGroupCollection = new Collection<IScarlettCommandWithSubCommands, Collection<string, ScarletSubcommandGroup>>();

export const getSubcommandsGroup = subcommandsGroupCollection.get;

export const WithSubcommandsGroup = (subCommandsGroup: ConstructorType<[], ScarletSubcommandGroup>[]) =>
	(target: IScarlettCommandWithSubCommands) => {
		const subCommandGroupsForCommandsCollection = new Collection<string, ScarletSubcommandGroup>();
		
		subCommandsGroup.map(subcommandGroup => new subcommandGroup()).map(subcommandGroup => {
			const descriptor = getCommandDescriptor(subcommandGroup);
			
			if (!descriptor) return;
			
			subCommandGroupsForCommandsCollection.set(descriptor.name, subcommandGroup);
		});
		
		subcommandsGroupCollection.set(target, subCommandGroupsForCommandsCollection);
	};