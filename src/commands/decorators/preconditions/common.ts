import {BaseCommand} from "../../interfaces";
import {Collection, CommandInteraction} from "discord.js";
import {EmptyConstructor} from "../../../types";

const commandPreconditions = new Collection<EmptyConstructor<BaseCommand>, Precondition[]>();

export const getCommandPreconditions = commandPreconditions.get;

export abstract class Precondition {
	abstract verify(interaction: CommandInteraction): boolean;
}

const preconditionInstances = new Collection<typeof Precondition, Precondition>();

export const WithPreconditions = (preconditions: (typeof Precondition)[]) => {
	return (target: EmptyConstructor<BaseCommand>) => {
		commandPreconditions.set(target, preconditions.map(precondition => {
			const instance = preconditionInstances.get(precondition);
			
			if (instance) return instance;
			
			const newInstance = new (precondition as any)();
			
			preconditionInstances.set(precondition, newInstance);
			
			return newInstance;
		}));
	};
};