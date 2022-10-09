import {Precondition} from "./common";
import {CommandInteraction} from "discord.js";

export class GuildOnly extends Precondition {
	verify(interaction: CommandInteraction): boolean {
		return interaction.inGuild();
	}
}