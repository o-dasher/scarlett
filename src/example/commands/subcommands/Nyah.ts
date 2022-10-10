import {
	ExecutableCommandNoOptions,
	GuildOnly,
	GuildPermissionsPrecondition,
	SubCommand,
	WithPreconditions
} from "../../../commands";
import {PermissionsBitField} from "discord.js";

@WithPreconditions([GuildOnly, new GuildPermissionsPrecondition([PermissionsBitField.Flags.Administrator])])
@ExecutableCommandNoOptions({
	execute: async (ctx) => {
		await ctx.interaction.reply("Nyah!");
	}
})
export default class Nyah extends SubCommand {
	override name = "nyah";
	override description = "owo";
}