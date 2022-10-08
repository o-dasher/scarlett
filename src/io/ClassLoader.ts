import {parseDirectory} from "./DirectoryParsing";
import {join, relative} from "path";
import {readdir} from "fs/promises";
import {FileExtensions} from "./FileExtensions";
import {Dirent} from "fs";
import {pathToFileURL} from "url";
import {getRootInfo, RunTime} from "./RootInfo";
import {ConstructorType} from "../types";
import {TWithOptionalPath, TWithPath} from "./Types";

type AnyTypedConstructor<T> = ConstructorType<[], T>;

type TBaseClassLoaderLoadArgs<T> = {
	onLoadedObject: (object: T) => void
}

type TClassLoaderLoadArgs<T> = TWithOptionalPath & TBaseClassLoaderLoadArgs<T>

type TClassLoaderLoadArgsOnParse<T> = TWithPath & TBaseClassLoaderLoadArgs<T>

export class ClassLoader<T> {
	klass: AnyTypedConstructor<T>;
	
	constructor(klass: AnyTypedConstructor<T>) {
		this.klass = klass;
	}
	
	async loadClassObjects(args: TClassLoaderLoadArgs<T>) {
		const {path} = args;
		await parseDirectory({
			path,
			onParse: async (path) => {
				await this.#loadClassObject({
					path,
					onLoadedObject: args.onLoadedObject
				});
			}
		});
	}
	
	async #loadClassObject({path, onLoadedObject}: TClassLoaderLoadArgsOnParse<T>) {
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