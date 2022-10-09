import {Precondition} from "./common";
import {CommandInteraction} from "discord.js";
import {singleton} from "tsyringe";

@singleton()
export class GuildOnly extends Precondition {
	verify(interaction: CommandInteraction): boolean {
		return interaction.inGuild();
	}
}