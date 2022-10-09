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
import {EmptyConstructor} from "../../types";

type ExecutableCommandParam = unknown;
type ExecutableCommandParams = Record<string, ExecutableCommandParam>;

export type WithArgs<A> = {
	args: A
}

export type BaseExecutableCommandContext = {
	interaction: CommandInteraction;
}

export type ExecutableCommandContext<A extends ExecutableCommandParams> = WithArgs<A> & BaseExecutableCommandContext;
export type ExecutableCommandContextNoArgs = BaseExecutableCommandContext;

export type AnyExecutableCommandContext = ExecutableCommandContextNoArgs | ExecutableCommandContext<any>

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

export type BaseExecutableCommandArgs<C extends BaseExecutableCommandContext> = {
	execute: (ctx: C) => Promise<void>
}

export type ExecutableCommandArgsNoOptions = BaseExecutableCommandArgs<ExecutableCommandContextNoArgs>;

export type ExecutableCommandArgs<A extends ExecutableCommandParams> =
	BaseExecutableCommandArgs<ExecutableCommandContext<A>> & {
	options: OptionsFromArgs<A>,
	execute: (ctx: ExecutableCommandContext<A>) => Promise<void>
}

export type AnyExecutableCommandArgs = BaseExecutableCommandArgs<any>;

export type AnyExecutableCommandArgsWithOptions = ExecutableCommandArgs<any>

export function isExecutableWithOptions(executable: AnyExecutableCommandArgs): executable is AnyExecutableCommandArgsWithOptions {
	return typeof (executable as AnyExecutableCommandArgsWithOptions).options === "object";
}

const executableCommandsMetadataHandler = new CommandExtensionMetadataHandler<AnyExecutableCommandArgs>();

export const getCommandExecutable = executableCommandsMetadataHandler.getMetadata;

const BaseExecutableCommandDecorator = <A extends AnyExecutableCommandArgs>(args: A) => {
	return (target: EmptyConstructor<PossibleExecutableCommand>) => executableCommandsMetadataHandler.createMetadata(target, () => args);
};

export const ExecutableCommandNoOptions = BaseExecutableCommandDecorator<ExecutableCommandArgsNoOptions>;

export function ExecutableCommand<A extends ExecutableCommandParams>(args: ExecutableCommandArgs<A>) {
	return BaseExecutableCommandDecorator(args);
}