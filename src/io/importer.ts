import {Directory, parseDirectoryRecursive} from "./directory";
import {join, relative} from "path";
import {pathToFileURL} from "url";
import {getRootInformation, RunTime} from "./root";
import {WithOptionalPath} from "./types";
import {EmptyConstructor, isConstructor} from "../types";
import {FileExtensions} from "./enum";

export class ModuleImporter<T> {
	importType: EmptyConstructor<T>;
	
	constructor(importType: EmptyConstructor<T>) {
		this.importType = importType;
	}
	
	async importAll(args: WithOptionalPath = {}) {
		const directories = await parseDirectoryRecursive(args);
		
		const imported = (await Promise.all(directories.map(async (dir) => await this.importSingleDirectory(dir)))).flat();
		
		return imported;
	}
	
	async importSingleDirectory(directory: Directory): Promise<T[]> {
		const realPaths = directory.files.map(file => join(directory.path, file.name));
		
		const importPaths = realPaths
			.map(path => getRootInformation().type === RunTime.Module
				? pathToFileURL(path).pathname
				: relative(__dirname, path)
			).filter(path => path.endsWith(FileExtensions.JS));
		
		const importModules = await Promise.all(importPaths.map(async (path) => {
			try {
				return await import(path);
			} catch (e) {}
		}));
		
		const importDefaults = importModules.filter(module => module).map(module => module.default);
		const importedInstances = importDefaults.filter(isConstructor).map(imported => new imported());
		
		return importedInstances.filter(instance => instance instanceof this.importType);
	}
}