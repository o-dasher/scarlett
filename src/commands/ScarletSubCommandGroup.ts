import {IScarlettCommandWithSubCommands} from "./interfaces";
import {TScarlettCommandContext} from "./TScarlettCommandContext";

export abstract class ScarletSubCommandGroup<TContext extends TScarlettCommandContext<never>>
	implements IScarlettCommandWithSubCommands {
}
