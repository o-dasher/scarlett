import {Collection, Interaction} from "discord.js";
import {ModuleImporter} from "../io/importer";
import {
	BaseCommand,
	Command,
	getCommandExecutable,
	getCommandPreconditions,
	getParentCommandSubCommands,
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
		
		if (executable)
			await executable.execute({interaction, args: {}});
	}
	
	#parseNestedCommand<C extends BaseCommand>({name, getAllNested}: ParseNestedArgs<C>) {
		if (!name) return;
		
		const allNesting = getAllNested();
		
		if (!allNesting) return;
		
		return allNesting.get(name);
	}
}
