import {join} from "path";
import {readdir} from "fs/promises";
import {getRootInformation} from "./root";
import {WithOptionalPath} from "./types";

export const parseDirectory = async (args: WithOptionalPath) => {
	args.path ??= getRootInformation().root;
	
	const {path} = args;
	
	const files = await readdir(path);
	const dirPaths = files.map(file => join(path, file));
	
	await Promise.all(dirPaths.map(async (path) => {
		await parseDirectory({
			...args,
			path
		});
	}));
	
	return dirPaths;
};