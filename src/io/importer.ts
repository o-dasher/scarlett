import {parseDirectory} from "./directory";
import {join, relative} from "path";
import {readdir} from "fs/promises";
import {Dirent} from "fs";
import {pathToFileURL} from "url";
import {getRootInformation, RunTime} from "./root";
import {WithOptionalPath, WithPath} from "./types";
import {EmptyConstructor} from "../types";
import {FileExtensions} from "./enum";


export class ModuleImporter<T> {
	importType: EmptyConstructor<T>;
	
	constructor(importType: EmptyConstructor<T>) {
		this.importType = importType;
	}
	
	async importAll(args: WithOptionalPath) {
		const {path} = args;
		
		const parsedPaths = await parseDirectory({
			path,
		});
		
		await Promise.all(parsedPaths.map(async (path) => {
			await this.importSingle({
				path
			});
		}));
	}
	
	async importSingle({path}: WithPath): Promise<T[]> {
		const files: Dirent[] = [];
		
		try {
			files.push(...(await readdir(path, {withFileTypes: true}))
				.filter(file => file.isFile() && file.name.endsWith(FileExtensions.JS)));
		} catch {
			return [];
		}
		
		const importPaths = files.map(file => {
			const realPath = join(path, file.name);
			
			return getRootInformation().type === RunTime.Module
				? pathToFileURL(realPath).pathname
				: relative(__dirname, realPath);
		});
		
		const importModules = await Promise.all(importPaths.map(async (path) => await import(path)));
		
		return importModules
			.map(module => module.default)
			.filter(exported => exported)
			.map(exported => new exported())
			.filter(instance => instance instanceof this.importType);
	}
}