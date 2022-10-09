import {Command, SubCommandGroup} from "../impl";
import {EmptyConstructor} from "../../types";
import {NestedCommandExtensionMetadataHandler} from "./common";

const subcommandGroupsMetadataHandler = new NestedCommandExtensionMetadataHandler<Command, SubCommandGroup>();

export const getSubcommandGroups = subcommandGroupsMetadataHandler.getMetadata;

export const CommandWithSubcommandGroups = (subCommandGroups: EmptyConstructor<SubCommandGroup>[]) =>
	(target: Command) => subcommandGroupsMetadataHandler.createNestedMetadata(target, subCommandGroups);