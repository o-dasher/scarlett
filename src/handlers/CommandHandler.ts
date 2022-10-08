import {
	getCommandDescriptor,
	getSubcommands, IScarlettCommand,
	IScarlettCommandWithTrigger,
	ScarlettCommand,
	TAnyScarlettCommand
} from "../commands";
import {ClassLoader} from "../io";
import {Collection, Interaction} from "discord.js";
import {getSubcommandsGroup} from "../commands/decorators/WithSubcommandsGroup";

type TParseNestedArgs<TCommand extends IScarlettCommand> = {
	name: string | null,
	getAllNested: () => Collection<string, TCommand> | undefined,
	onSuccess: (selectedCommand: TCommand) => void
}

export class CommandHandler {
	readonly commands = new Collection<string, TAnyScarlettCommand>();
	
	async loadCommands() {
		const loader = new ClassLoader<TAnyScarlettCommand>(ScarlettCommand as never);
		
		await loader.loadClassObjects({
			onLoadedObject: object => {
				const descriptor = getCommandDescriptor(object);
				
				if (!descriptor)
					throw `Missing command descriptor for command of class ${Object.getPrototypeOf(object).name}.`;
				
				this.commands.set(descriptor.name, object);
			}
		});
	}
	
	#parseNestedCommand<TCommand extends IScarlettCommand>({name, getAllNested}: TParseNestedArgs<TCommand>) {
		if (!name) return;
		
		const allNesting = getAllNested();
		
		if (!allNesting) return;
		
		return allNesting.get(name);
	}
	
	async processCommand(interaction: Interaction) {
		if (!interaction.isCommand() || !interaction.isChatInputCommand()) return;
		
		const command = this.commands.get(interaction.commandName);
		
		if (!command) return;
		
		const commandChain: IScarlettCommand[] = [command];
		
		let parentCommand: IScarlettCommand = command;
		let executorCommand: IScarlettCommandWithTrigger<never> = command;
		
		this.#parseNestedCommand({
			name: interaction.options.getSubcommandGroup(),
			getAllNested: () => getSubcommandsGroup(command),
			onSuccess: (selectedCommand) => {
				commandChain.push(parentCommand = selectedCommand);
			}
		});
		
		this.#parseNestedCommand({
			name: interaction.options.getSubcommand(),
			getAllNested: () => getSubcommands(parentCommand),
			onSuccess: (selectedCommand) => {
				commandChain.push(executorCommand = selectedCommand);
			}
		});
		
		console.log(commandChain.map(command => `${getCommandDescriptor(command)!.name} -> `));
	}
}
