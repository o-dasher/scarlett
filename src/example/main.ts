import {ScarlettClient, ScarlettClientEvents} from "../client";
import {TOKEN} from "./config.json";

const bot = new ScarlettClient({
	intents: []
});

bot.once(ScarlettClientEvents.SetupFinished, () => {
	bot.commandsHandler.commands.map(command => command.name).forEach(console.log);
});

void bot.login(TOKEN);
