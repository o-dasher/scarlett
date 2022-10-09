import {
	Collection,
	Interaction, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandNumberOption, SlashCommandRoleOption,
	SlashCommandStringOption, SlashCommandUserOption
} from "discord.js";
import {ModuleImporter} from "../io/importer";
import {
	BaseCommand,
	Command,
	getCommandExecutable,
	getCommandPreconditions,
	getParentCommandSubCommands, isExecutableWithOptions,
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
	
	async loadCommands() {
		const importer = new ModuleImporter(Command);
		
		await importer.importAll({
			onImport: command => {
				this.commands.set(command.name, command);
			}
		});
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
		
		const args: Record<string, any> = {};
		
		if (!isExecutableWithOptions(executable)) {
			await executable.execute({interaction})
		} else {
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
				
				args[key] = parser(option.name);
			}
			
			await executable.execute({interaction, args});
		}
	}
	
}
