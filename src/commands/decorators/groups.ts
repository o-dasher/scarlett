import {Command, SubCommandGroup} from "../impl";
import {EmptyConstructor} from "../../types";
import {NestedCommandExtensionMetadataHandler} from "./common";

const subcommandGroupsMetadataHandler = new NestedCommandExtensionMetadataHandler<EmptyConstructor<Command>, SubCommandGroup>();

export const getSubcommandGroups = subcommandGroupsMetadataHandler.getMetadata;

export const CommandWithSubcommandGroups = (subCommandGroups: EmptyConstructor<SubCommandGroup>[]) =>
	(target: EmptyConstructor<Command>) => subcommandGroupsMetadataHandler.createNestedMetadata(target, subCommandGroups);