import {Collection} from "discord.js";
import {IScarlettCommandWithSubCommands} from "../interfaces/IScarlettCommandWithSubCommands";
import {ScarlettCommand} from "../ScarlettCommand";

export type TGenericSubCommand = ScarlettCommand<never>;

const subCommandsMap = new Collection<IScarlettCommandWithSubCommands, TGenericSubCommand[]>();

export const getSubCommands = subCommandsMap.get;

export const WithSubCommands = (subCommands: ConstructorType<[], TGenericSubCommand>[]) =>
	(target: IScarlettCommandWithSubCommands) => {
		subCommandsMap.set(target, subCommands.map(subCommand => new subCommand()));
	}