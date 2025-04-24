require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { translateReply } = require('./textTranslate.js');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

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

