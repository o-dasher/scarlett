import {
	ExecutableCommandNoOptions,
	GuildOnly,
	SubCommand,
	WithPreconditions
} from "../../../commands";

@WithPreconditions([GuildOnly])
@ExecutableCommandNoOptions({
	execute: async (ctx) => {
		await ctx.interaction.reply("Nyah!")
	}
})
export default class Nyah extends SubCommand {

}