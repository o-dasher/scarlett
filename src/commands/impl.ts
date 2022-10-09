import {SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder} from "discord.js";
import {BaseCommand} from "./interfaces";

export class Command extends SlashCommandBuilder implements BaseCommand {}

export class SubCommand extends SlashCommandSubcommandBuilder implements BaseCommand {}

export class SubCommandGroup extends SlashCommandSubcommandGroupBuilder implements BaseCommand {}
