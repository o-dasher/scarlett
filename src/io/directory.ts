import {join} from "path";
import {readdir} from "fs/promises";
import {getRootInformation} from "./root";
import {WithOptionalPath} from "./types";

export type ParseDirectoryArgs = WithOptionalPath & {
	onParse: (path: string) => Promise<void>
}

export const parseDirectory = async (args: ParseDirectoryArgs) => {
	args.path ??= getRootInformation().root;
	
	const {path, onParse} = args;
	
	const files = await readdir(path);
	const dirPaths = files.map(file => join(path, file));
	
	await Promise.all(dirPaths.map(async (path) => {
		await onParse(path);
		await parseDirectory({
			...args,
			path
		});
	}));
};