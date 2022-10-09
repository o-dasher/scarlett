import {Precondition} from "./common";
import {CommandInteraction, PermissionResolvable} from "discord.js";

export class GuildPermissionsPrecondition extends Precondition {
	public readonly requiredPermissions: PermissionResolvable;
	
	public constructor(requiredPermissions: PermissionResolvable) {
		super();
		this.requiredPermissions = requiredPermissions;
	}
	
	verify(interaction: CommandInteraction): boolean {
		if (!interaction.inGuild()) return false;
		
		return interaction.memberPermissions.has(this.requiredPermissions);
	}
}
