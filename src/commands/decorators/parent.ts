import {Command, SubCommand, SubCommandGroup} from "../impl";
import {Constructor} from "../../types";
import {NestedCommandExtensionMetadataHandler} from "./common";

export type PossibleParentCommand = Command | SubCommandGroup;

const parentCommandsMetadataHandler = new NestedCommandExtensionMetadataHandler<PossibleParentCommand, SubCommand>();

export const getParentCommandSubCommands = parentCommandsMetadataHandler.getMetadata;

export const ParentCommand = (subCommands: Constructor<[], SubCommand>[]) =>
	(target: PossibleParentCommand) => parentCommandsMetadataHandler.createNestedMetadata(target, subCommands);