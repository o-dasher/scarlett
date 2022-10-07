import {TScarlettCommandContext} from "./TScarlettCommandContext";
import {IScarlettCommandWithTrigger} from "./interfaces";

export abstract class ScarlettSubCommand<TContext extends TScarlettCommandContext<never>> implements IScarlettCommandWithTrigger<TContext> {
	abstract trigger(context: TContext): Promise<void>
}
