import {Collection, Interaction} from "discord.js";
import {ModuleImporter} from "../io/importer";
import {
	BaseCommand,
	Command, getCommandsTrigger,
	getParentCommandSubCommands,
	PossibleCommandWithTrigger,
	PossibleParentCommand
} from "../commands";
import {getSubcommandGroups} from "../commands/decorators/groups";

type ParseNestedArgs<C extends BaseCommand> = {
	name: string | null,
	getAllNested: () => Collection<string, C> | undefined,
	onSuccess: (selectedCommand: C) => void
}

export class Commands {
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
		let executorCommand: PossibleCommandWithTrigger = command;
		
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
		
		console.log(commandChain.map(command => `${command.name} -> `));
		
		const trigger = getCommandsTrigger(executorCommand);
		
		if (trigger)
			await trigger.trigger({interaction, args: {}});
	}
}
