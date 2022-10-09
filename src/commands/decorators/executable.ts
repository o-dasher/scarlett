import {
	Attachment,
	Channel,
	CommandInteraction,
	Role,
	SlashCommandAttachmentOption,
	SlashCommandBooleanOption,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandNumberOption,
	SlashCommandRoleOption,
	SlashCommandStringOption,
	SlashCommandUserOption,
	User
} from "discord.js";
import {Command, SubCommand} from "../impl";
import {CommandExtensionMetadataHandler} from "./common";

type ExecutableCommandParam = never;
type ExecutableCommandParams = Record<string, ExecutableCommandParam>;

export type ExecutableCommandContext<A extends ExecutableCommandParams> = {
	interaction: CommandInteraction,
	args: A
}

export type OptionFromArg<A extends ExecutableCommandParam> =
	A extends number ? SlashCommandNumberOption | SlashCommandIntegerOption :
		A extends string ? SlashCommandStringOption :
			A extends boolean ? SlashCommandBooleanOption :
				A extends Channel ? SlashCommandChannelOption :
					A extends User ? SlashCommandUserOption :
						A extends Role ? SlashCommandRoleOption :
							A extends Attachment ? SlashCommandAttachmentOption :
								undefined;

export type PossibleExecutableCommand = Command | SubCommand;

export type OptionsFromArgs<A extends ExecutableCommandParams> = {
	[Prop in keyof A]: OptionFromArg<A[Prop]>;
}

export type ExecutableCommandArgs<A extends ExecutableCommandParams> = {
	options: OptionsFromArgs<A>,
	execute: (ctx: ExecutableCommandContext<A>) => Promise<void>
}

export type AnyExecutableCommandArgs = ExecutableCommandArgs<any>;

const executableCommandsMetadataHandler = new CommandExtensionMetadataHandler<PossibleExecutableCommand, AnyExecutableCommandArgs>();

export const getCommandExecutable = executableCommandsMetadataHandler.getMetadata;

export function ExecutableCommand<A extends ExecutableCommandParams>(args: ExecutableCommandArgs<A>) {
	return (target: PossibleExecutableCommand) => executableCommandsMetadataHandler.createMetadata(target, () => args);
}