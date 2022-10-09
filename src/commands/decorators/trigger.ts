import {
	Attachment,
	Channel,
	CommandInteraction, Role, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandNumberOption, SlashCommandRoleOption,
	SlashCommandStringOption, SlashCommandUserOption, User
} from "discord.js";
import {Command, SubCommand} from "../impl";
import {CommandExtensionMetadataHandler} from "./common";

type CommandTriggerArg = any;
type CommandTriggerContextArgs = Record<string, CommandTriggerArg>;

export type CommandTriggerContext<A extends CommandTriggerContextArgs> = {
	interaction: CommandInteraction,
	args: A
}

export type OptionFromArg<A extends CommandTriggerArg> =
	A extends number ? SlashCommandNumberOption | SlashCommandIntegerOption :
		A extends string ? SlashCommandStringOption :
			A extends boolean ? SlashCommandBooleanOption :
				A extends Channel ? SlashCommandChannelOption :
					A extends User ? SlashCommandUserOption :
						A extends Role ? SlashCommandRoleOption :
							A extends Attachment ? SlashCommandAttachmentOption :
								undefined;

export type PossibleCommandWithTrigger = Command | SubCommand;

export type OptionsFromArgs<A extends CommandTriggerContextArgs> = {
	[Prop in keyof A]: OptionFromArg<A[Prop]>;
}

export type CommandWithTriggerArgs<A extends CommandTriggerContextArgs> = {
	options: OptionsFromArgs<A>,
	trigger: (ctx: CommandTriggerContext<A>) => Promise<void>
}

export type AnyCommandWithTriggerArgs = CommandWithTriggerArgs<any>;

const triggerCommandsMetadataHandler = new CommandExtensionMetadataHandler<PossibleCommandWithTrigger, AnyCommandWithTriggerArgs>();

export const getCommandsTrigger = triggerCommandsMetadataHandler.getMetadata;

export function CommandWithTrigger<A extends CommandTriggerContextArgs>(args: CommandWithTriggerArgs<A>) {
	return (target: PossibleCommandWithTrigger) => triggerCommandsMetadataHandler.createMetadata(target, () => args);
}