import {IScarlettCommandWithTrigger} from "./interfaces/IScarlettCommandWithTrigger";
import {TScarlettCommandContext} from "./TScarlettCommandContext";
import {IScarlettCommandWithSubCommands} from "./interfaces/IScarlettCommandWithSubCommands";

export abstract class ScarlettCommand<TContext extends TScarlettCommandContext<never>>
	implements IScarlettCommandWithTrigger<TContext>, IScarlettCommandWithSubCommands {
	abstract trigger(context: TContext): Promise<void>
}
