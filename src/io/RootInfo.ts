import {readFileSync} from "fs";
import {dirname, join} from "path";

export enum RunTime {
	Module,
	CommonJS
}

export type RootInfo = {
	root: string,
	type: RunTime
}

let rootInfo: RootInfo;

export const getRootInfo = () => {
	if (rootInfo) return rootInfo;
	
	const cwd = process.cwd();
	
	try {
		const file = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
		rootInfo = {
			root: dirname(join(cwd, file.main)),
			type: file.type === "module" ? RunTime.Module : RunTime.CommonJS,
		};
	} catch {
		rootInfo = {root: cwd, type: RunTime.CommonJS};
	}
	
	return rootInfo;
};