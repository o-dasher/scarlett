import {Command, SubCommand, SubCommandGroup} from "../impl";
import {EmptyConstructor} from "../../types";
import {NestedCommandExtensionMetadataHandler} from "./common";

export type PossibleParentCommand = Command | SubCommandGroup;

const parentCommandsMetadataHandler = new NestedCommandExtensionMetadataHandler<SubCommand>();

export const getParentCommandSubCommands = parentCommandsMetadataHandler.getMetadata;

export const ParentCommand = (subCommands: EmptyConstructor<SubCommand>[]) =>
	(target: EmptyConstructor<PossibleParentCommand>) => parentCommandsMetadataHandler.createNestedMetadata(target, subCommands);