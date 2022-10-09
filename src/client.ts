import {Client} from "discord.js";
import {LimitedCalls} from "./decorators";
import {CommandsHandler} from "./handlers";

export class ScarlettClient extends Client {
	readonly commandsHandler = new CommandsHandler();
	
	@LimitedCalls()
	async onceLogin() {
		await this.commandsHandler.loadCommands();
		this.on("interactionCreate", async (interaction) => {
			await this.commandsHandler.processCommand(interaction);
		});
	}
	
	override async login(token?: string) {
		const response = await super.login(token);
		
		await this.onceLogin();
		
		return response;
	}
}