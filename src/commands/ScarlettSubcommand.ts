import {TScarlettCommandContext} from "./TScarlettCommandContext";
import {IScarlettCommandWithTrigger} from "./interfaces";

export abstract class ScarlettSubcommand<TContext extends TScarlettCommandContext<never>> implements IScarlettCommandWithTrigger<TContext> {
	abstract trigger(context: TContext): Promise<void>
}

export type TAnyScarlettSubCommand = ScarlettSubcommand<never>
