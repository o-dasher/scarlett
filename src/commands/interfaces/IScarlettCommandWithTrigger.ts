import {TScarlettCommandContext} from "../TScarlettCommandContext";
import {IScarlettCommand} from "./IScarlettCommand";

export interface IScarlettCommandWithTrigger<TContext extends TScarlettCommandContext<never>> extends IScarlettCommand {
	trigger: (context: TContext) => Promise<void>;
}