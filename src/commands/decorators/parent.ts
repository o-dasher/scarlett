import {Command, SubCommand, SubCommandGroup} from "../impl";
import {EmptyConstructor} from "../../types";
import {NestedCommandExtensionMetadataHandler} from "./common";

export type PossibleParentCommand = Command | SubCommandGroup;

const parentCommandsMetadataHandler = new NestedCommandExtensionMetadataHandler<PossibleParentCommand, SubCommand>();

export const getParentCommandSubCommands = parentCommandsMetadataHandler.getMetadata;

export const ParentCommand = (subCommands: EmptyConstructor<SubCommand>[]) =>
	(target: PossibleParentCommand) => parentCommandsMetadataHandler.createNestedMetadata(target, subCommands);