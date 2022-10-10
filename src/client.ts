import type {ClientOptions} from "discord.js";
import {Client, Events} from "discord.js";
import {CommandDeployHandler, CommandsHandler} from "./handlers";
import {NewEvent, TypedEventEmitter} from "./types/events";

export enum ScarlettClientEvents {
	SetupFinished = "setupFinished"
}

export class ScarlettClient extends Client {
	readonly events = new TypedEventEmitter<[NewEvent<ScarlettClientEvents>]>();
	
	readonly commandsHandler = new CommandsHandler();
	readonly commandsDeployer = new CommandDeployHandler({
		commandsHandler: this.commandsHandler
	});
	
	public constructor(options: ClientOptions) {
		super(options);
		
		this.once(Events.ClientReady, async () => {
			await this.commandsHandler.loadCommands();
			
			this.events.emit(ScarlettClientEvents.SetupFinished);
		});
		
		this.on(Events.InteractionCreate, async (interaction) => {
			await this.commandsHandler.processCommand(interaction);
		});
	}
}