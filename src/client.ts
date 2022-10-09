import type {ClientOptions} from "discord.js";
import {Client, Events} from "discord.js";
import {CommandDeployHandler, CommandsHandler} from "./handlers";

export class ScarlettClient extends Client {
	readonly commandsHandler = new CommandsHandler();
	readonly commandsDeployer = new CommandDeployHandler({
		commandsHandler: this.commandsHandler
	});
	
	public constructor(options: ClientOptions) {
		super(options);
		
		this.on(Events.InteractionCreate, async (interaction) => {
			await this.commandsHandler.processCommand(interaction);
		});
		
		this.once(Events.ClientReady, async () => {
			await this.commandsHandler.loadCommands();
		});
	}
}