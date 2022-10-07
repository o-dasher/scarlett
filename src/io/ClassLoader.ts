import {parseDirectory} from "./DirectoryParsing";
import {join, relative} from "path";
import {readdir} from "fs/promises";
import {FileExtensions} from "./FileExtensions";
import {Dirent} from "fs";
import {pathToFileURL} from "url";
import {getRootInfo, RunTime} from "./RootInfo";
import {ConstructorType} from "../types";

type AnyTypedConstructor<T> = ConstructorType<[], T>;

export class ClassLoader<T> {
	klass: AnyTypedConstructor<T>;
	
	constructor(klass: AnyTypedConstructor<T>) {
		this.klass = klass;
	}
	
	async loadClassObjects(path: string) {
		await parseDirectory({
			path,
			onParse: this.loadClassObjects
		});
	}
	
	async loadClassObject(path: string, onLoadedObject: (object: T) => void) {
		const files: Dirent[] = [];
		
		try {
			files.push(...(await readdir(path, {withFileTypes: true}))
				.filter(file => file.isFile() && file.name.endsWith(FileExtensions.JS)));
		} catch {
			return files;
		}
		
		for (const file of files) {
			const realPath = join(path, file.name);
			
			const importPath =
				getRootInfo().type === RunTime.Module
					? pathToFileURL(realPath).pathname
					: relative(__dirname, realPath);
			
			const module = await import(importPath);
			
			if (!module.default) {
				console.error(`Missing default export trying to import a ${this.klass.name} at ${realPath}`);
				return;
			}
			
			const klass = module.default;
			const object = new klass(...[]);
			
			if (object instanceof this.klass) {
				console.log(`Imported a ${klass.name} as a instance of ${this.klass.name}.`);
				onLoadedObject(object);
			}
		}
	}
}