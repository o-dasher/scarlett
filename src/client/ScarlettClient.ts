import {Client, ClientOptions} from "discord.js";
import {LimitedCalls} from "../decorators/LimitedCalls";

export class ScarlettClient extends Client {
	constructor(options: ClientOptions) {
		super(options);
	}
	
	@LimitedCalls()
	async onceLogin() {
	}
	
	override async login(token?: string) {
		const response = await super.login(token);
		
		await this.onceLogin();
		
		return response;
	}
}