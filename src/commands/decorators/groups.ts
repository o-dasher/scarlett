import {Command, SubCommandGroup} from "../impl";
import {Constructor} from "../../types";
import {NestedCommandExtensionMetadataHandler} from "./common";

const subcommandGroupsMetadataHandler = new NestedCommandExtensionMetadataHandler<Command, SubCommandGroup>();

export const getSubcommandGroups = subcommandGroupsMetadataHandler.getMetadata;

export const CommandWithSubcommandGroups = (subCommandGroups: Constructor<[], SubCommandGroup>[]) =>
	(target: Command) => subcommandGroupsMetadataHandler.createNestedMetadata(target, subCommandGroups);