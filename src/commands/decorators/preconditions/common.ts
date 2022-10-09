import {BaseCommand} from "../../interfaces";
import {Collection, CommandInteraction} from "discord.js";

const commandPreconditions = new Collection<BaseCommand, Precondition[]>();

export const getCommandPreconditions = commandPreconditions.get;

export abstract class Precondition {
	Decorate() {
		return (target: BaseCommand) => {
			if (commandPreconditions.has(target))
				commandPreconditions.get(target)!.push(this);
			else
				commandPreconditions.set(target, [this]);
		};
	}
	
	abstract verify(interaction: CommandInteraction): boolean;
}