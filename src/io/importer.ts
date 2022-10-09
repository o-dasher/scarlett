import {parseDirectory} from "./directory";
import {join, relative} from "path";
import {readdir} from "fs/promises";
import {Dirent} from "fs";
import {pathToFileURL} from "url";
import {getRootInformation, RunTime} from "./root";
import {WithOptionalPath, WithPath} from "./types";
import {EmptyConstructor} from "../types";
import {FileExtensions} from "./enum";

type ImporterArgs<T> = {
	onImport: (object: T) => void
}

type ImporterImportArgs<T> = WithOptionalPath & ImporterArgs<T>

type ImporterParsedArgs<T> = WithPath & ImporterArgs<T>

export class ModuleImporter<T> {
	importType: EmptyConstructor<T>;
	
	constructor(importType: EmptyConstructor<T>) {
		this.importType = importType;
	}
	
	async importAll(args: ImporterImportArgs<T>) {
		const {path} = args;
		await parseDirectory({
			path,
			onParse: async (path) => {
				await this.importSingle({
					path,
					onImport: args.onImport
				});
			}
		});
	}
	
	async importSingle({path, onImport}: ImporterParsedArgs<T>) {
		const files: Dirent[] = [];
		
		try {
			files.push(...(await readdir(path, {withFileTypes: true}))
				.filter(file => file.isFile() && file.name.endsWith(FileExtensions.JS)));
		} catch {
			return files;
		}
		
		const importPaths = files.map(file => {
			const realPath = join(path, file.name);
			
			return getRootInformation().type === RunTime.Module
				? pathToFileURL(realPath).pathname
				: relative(__dirname, realPath);
		});
		
		await Promise.all(importPaths.map(async (path) => {
			const module = await import(path);
			
			if (!module.default) {
				console.error(`Missing default export trying to import a ${this.importType.name} at ${path}`);
				return;
			}
			
			const type = module.default;
			const object = new type(...[]);
			
			if (object instanceof this.importType) {
				console.log(`Imported a ${type.name} as a instance of ${this.importType.name}.`);
				onImport(object);
			}
		}));
	}
}