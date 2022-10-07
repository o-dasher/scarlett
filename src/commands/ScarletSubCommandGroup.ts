import {TScarlettCommandContext} from "./TScarlettCommandContext";
import {IScarlettCommandWithSubCommands} from "./interfaces/IScarlettCommandWithSubCommands";

export abstract class ScarletSubCommandGroup<TContext extends TScarlettCommandContext<never>>
	implements IScarlettCommandWithSubCommands {
}
