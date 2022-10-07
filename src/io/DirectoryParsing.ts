import {join} from "path";
import {readdir} from "fs/promises";
import {getRootInfo} from "./RootInfo";

export type TParseDirectoryArgs = {
	path?: string,
	onParse: (path: string) => Promise<void>
}

export const parseDirectory = async (args: TParseDirectoryArgs) => {
	args.path ??= getRootInfo().root;
	
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