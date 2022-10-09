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
	
	for (const file of files) {
		const dirPath = join(path, file);
		
		await onParse(path);
		
		await parseDirectory({
			...args,
			path: dirPath
		});
	}
};