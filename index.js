import bodyParser from 'body-parser';
import { ChatGPTAPI } from 'chatgpt';
import cors from 'cors';
import env from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

const app = express();

env.config();

app.use(cors());
app.use(bodyParser.json());

// Initialize ChatGPT
const chatgpt = new ChatGPTAPI({
	apiKey: process.env.API_KEY,
	fetch
});

// dummy route to test
app.get('/', (req, res) => {
	res.send('Hello World!');
});

//post route for making requests
app.post('/', async (req, res) => {
	const { message } = req.body;
	try {
		let response;
		if (req.body.conversationId) {
			response = await chatgpt
				.sendMessage(message, {
					conversationId: req.body.conversationId,
					parentMessageId: req.body.lastMessageId,
					timeoutMs: 30 * 1000 // 30 Second timeout
				})
				.catch(() => res.sendStatus(400));
		} else {
			response = await chatgpt
				.sendMessage(message, {
					timeoutMs: 30 * 1000 // 30 Second timeout
				})
				.catch(() => res.sendStatus(400));
		}
		if ('text' in response) res.json(response);
	} catch (e) {
		console.error(e);
		res.sendStatus(400);
	}
});

// listeninng
app.listen('3080', () => console.log('listening on port 3080'));
