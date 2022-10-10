import {
	ClientApplication,
	Collection, CommandInteraction, Guild,
	Interaction,
	SlashCommandAttachmentOption,
	SlashCommandBooleanOption,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandNumberOption,
	SlashCommandRoleOption,
	SlashCommandStringOption,
	SlashCommandUserOption
} from "discord.js";
import {ModuleImporter} from "../io/importer";
import {
	AnyExecutableCommandContext,
	BaseCommand,
	Command,
	getCommandExecutable,
	getCommandPreconditions,
	getParentCommandSubCommands,
	isExecutableWithOptions,
	PossibleExecutableCommand,
	PossibleParentCommand
} from "../commands";
import {getSubcommandGroups} from "../commands/decorators/groups";

type ParseNestedArgs<C extends BaseCommand> = {
	name: string | null,
	getAllNested: () => Collection<string, C> | undefined,
	onSuccess: (selectedCommand: C) => void
}

export class CommandsHandler {
	readonly commands = new Collection<string, Command>();
	readonly importer = new ModuleImporter(Command);
	
	async loadCommands() {
		const commands = await this.importer.importAll();
		commands.forEach(command => this.commands.set(command.name, command));
	}
	
	#parseNestedCommand<C extends BaseCommand>({name, getAllNested}: ParseNestedArgs<C>) {
		if (!name) return;
		
		const allNesting = getAllNested();
		
		if (!allNesting) return;
		
		return allNesting.get(name);
	}
	
	async processCommand(interaction: Interaction) {
		if (!interaction.isCommand() || !interaction.isChatInputCommand()) return;
		
		const command = this.commands.get(interaction.commandName);
		
		if (!command) return;
		
		const commandChain: BaseCommand[] = [command];
		
		let parentCommand: PossibleParentCommand = command;
		let executorCommand: PossibleExecutableCommand = command;
		
		this.#parseNestedCommand({
			name: interaction.options.getSubcommandGroup(),
			getAllNested: () => getSubcommandGroups(command),
			onSuccess: (subcommandGroup) => {
				commandChain.push(parentCommand = subcommandGroup);
			}
		});
		
		this.#parseNestedCommand({
			name: interaction.options.getSubcommand(),
			getAllNested: () => getParentCommandSubCommands(parentCommand),
			onSuccess: (selectedCommand) => {
				commandChain.push(executorCommand = selectedCommand);
			}
		});
		
		const verifiedPreconditions = commandChain.every(chain => {
			const preconditions = getCommandPreconditions(chain);
			
			if (!preconditions)
				return true;
			
			return preconditions.every(precondition => precondition.verify(interaction));
		});
		
		if (!verifiedPreconditions) return;
		
		const executable = getCommandExecutable(executorCommand);
		
		if (!executable) return;
		
		let context: AnyExecutableCommandContext = {interaction, args: {}};
		
		if (isExecutableWithOptions(executable)) {
			for (const key in executable.options) {
				let parser: (name: string) => unknown;
				
				const option = executable.options[key]!;
				
				switch (true) {
					case option instanceof SlashCommandNumberOption:
						parser = interaction.options.getNumber;
						break;
					case option instanceof SlashCommandIntegerOption:
						parser = interaction.options.getInteger;
						break;
					case option instanceof SlashCommandStringOption:
						parser = interaction.options.getString;
						break;
					case option instanceof SlashCommandBooleanOption:
						parser = interaction.options.getBoolean;
						break;
					case option instanceof SlashCommandChannelOption:
						parser = interaction.options.getChannel;
						break;
					case option instanceof SlashCommandUserOption:
						parser = interaction.options.getUser;
						break;
					case option instanceof SlashCommandRoleOption:
						parser = interaction.options.getRole;
						break;
					case option instanceof SlashCommandAttachmentOption:
						parser = interaction.options.getAttachment;
						break;
					default:
						continue;
				}
				
				context.args[key] = parser(option.name);
			}
		}
		
		await executable.execute(context);
	}
}

type CommandDeployHandlerOptions = {
	guild?: Guild
	debug?: boolean
	application?: ClientApplication
	commandsHandler: CommandsHandler
}

export class CommandDeployHandler {
	guild?: Guild;
	debug?: boolean;
	application?: ClientApplication;
	commandsHandler: CommandsHandler;
	
	public constructor({guild, debug, application, commandsHandler}: CommandDeployHandlerOptions) {
		this.guild = guild;
		this.debug = debug;
		this.application = application;
		this.commandsHandler = commandsHandler;
	}
	
	async deploy(options: {
		commandName: string,
		interaction: CommandInteraction,
	}) {
		const {commandName, interaction} = options;
		
		const command = this.commandsHandler.commands.get(commandName);
		
		if (!command) return;
		
		const path = this.debug ? this.guild?.commands ?? interaction.guild?.commands : this.application?.commands;
		
		if (!path) {
			return;
		}
		
		await path?.create(command.toJSON());
	}
}