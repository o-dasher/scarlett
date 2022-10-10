import {readdir} from "fs/promises";
import {getRootInformation} from "./root";
import {WithOptionalPath, WithPath} from "./types";
import {join} from "path";
import {Dirent} from "fs";

export type Directory = {
	path: string
	files: Dirent[]
	nested: Directory[]
}

const defaultArgs = (args: WithOptionalPath): WithPath => {
	return {
		path: args.path ??= getRootInformation().root
	};
};

export const parseDirectory = async (args: WithOptionalPath): Promise<Directory> => {
	const {path} = defaultArgs(args);
	
	const files = await readdir(path, {withFileTypes: true});
	
	return {
		path,
		files: files.filter(file => file.isFile()),
		nested: files.filter(file => file.isDirectory()).map(file => join(path, file.name)).map(path => {
			return {
				path,
				files: [],
				nested: []
			};
		})
	};
};

export const parseDirectoryRecursive = async (args: WithOptionalPath) => {
	const defaultedArgs = defaultArgs(args);
	
	const dir = await parseDirectory(defaultedArgs);
	const dirs: Directory[] = [dir];
	
	const parsedNesting = await Promise.all(
		dir.nested.map(dir => dir.path).map(async (path) => await parseDirectoryRecursive({path}))
	);
	
	dirs.push(...parsedNesting.flat());
	
	return dirs;
};