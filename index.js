require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const OAI = require('openai');
const OpenAI = OAI.OpenAI;
const { translateReply } = require('./textTranslate.js');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

bot.on('polling_error', (error) => {
    console.log(error);  // => 'EFATAL'
});

bot.on('message',async (msg) => {
    
    if(!msg.text){
        return;
    }

    bot.sendMessage(msg.chat.id, await translateReply(msg), {
        reply_to_message_id: msg.message_id
    }).catch((error) => {
        console.error('Error sending message:', error);
    });

});

