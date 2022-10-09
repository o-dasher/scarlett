import {BaseCommand} from "../../interfaces";
import {Collection, CommandInteraction} from "discord.js";
import {EmptyConstructor} from "../../../types";

const commandPreconditions = new Collection<EmptyConstructor<BaseCommand>, Precondition[]>();

export const getCommandPreconditions = commandPreconditions.get;

export abstract class Precondition {
	abstract verify(interaction: CommandInteraction): boolean;
}

export const WithPreconditions = (preconditions: (typeof Precondition)[]) => {
	return (target: EmptyConstructor<BaseCommand>) => {
		commandPreconditions.set(target, preconditions.map(precondition => new (precondition as EmptyConstructor<Precondition>)()));
	};
};