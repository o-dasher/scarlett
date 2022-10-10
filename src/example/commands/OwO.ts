import {Command, ExecutableCommand, ParentCommand} from "../../commands";
import {SlashCommandBooleanOption} from "discord.js";
import Nyah from "./subcommands/Nyah";

type Params = {
	uwu: boolean;
}

@ParentCommand([Nyah])
@ExecutableCommand<Params>({
	options: {
		uwu: new SlashCommandBooleanOption()
	},
	execute: async (ctx) => {
		const {interaction, args} = ctx;
		const {uwu} = args;
		
		await interaction.reply(uwu ? "UwU" : "Evil UwU...");
	}
})
export default class OwO extends Command {
	override name = "owo";
	override description = "nyah";
}