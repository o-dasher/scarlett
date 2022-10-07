import {CommandInteraction} from "discord.js";

export type TScarlettCommandContext<TArgs> = {
	interaction: CommandInteraction
	args: TArgs
}