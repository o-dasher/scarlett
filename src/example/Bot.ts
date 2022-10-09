import {ScarlettClient} from "../client";

class Bot extends ScarlettClient {}

const MyBot = new Bot({
	intents: []
});

void MyBot.login();