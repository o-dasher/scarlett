import {Collection} from "discord.js";
import {IScarlettCommand} from "../interfaces/IScarlettCommand";

export type TCommandDescriptor = {
	name: string,
	description: string
}

const commandDescriptorMap = new Collection<IScarlettCommand, TCommandDescriptor>()

export const getCommandDescriptor = commandDescriptorMap.get;

export const CommandDescriptor = (information: TCommandDescriptor) =>
	(target: IScarlettCommand) => {
		commandDescriptorMap.set(target, information);
	}

