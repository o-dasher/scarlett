import {TScarlettCommandContext} from "./TScarlettCommandContext";
import {IScarlettCommandWithSubCommands, IScarlettCommandWithTrigger} from "./interfaces";

export abstract class ScarlettCommand<TContext extends TScarlettCommandContext<never>>
	implements IScarlettCommandWithTrigger<TContext>, IScarlettCommandWithSubCommands {
	abstract trigger(context: TContext): Promise<void>
}

export type TAnyScarlettCommand = ScarlettCommand<never>;
