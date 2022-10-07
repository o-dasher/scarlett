import {TScarlettCommandContext} from "./TScarlettCommandContext";
import {IScarlettCommandWithTrigger} from "./interfaces/IScarlettCommandWithTrigger";

export abstract class ScarlettSubCommand<TContext extends TScarlettCommandContext<never>> implements IScarlettCommandWithTrigger<TContext> {
	abstract trigger(context: TContext): Promise<void>
}
