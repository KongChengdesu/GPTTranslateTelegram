require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const OAI = require('openai');
const OpenAI = OAI.OpenAI;

const maxMessages = 4;

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

bot.on('polling_error', (error) => {
    console.log(error);  // => 'EFATAL'
});

bot.on('message', (msg) => {
    
    if(!msg.text){
        return;
    }

    translateReply(msg);

});

console.log("Starting");

async function translateReply(msg){
    
    var messages = [
        {
            role: "system",
            content: "判断用户输入的文本是否是中文还是葡萄牙语，并翻译成对应的语言。你的回复应只包括翻译后的文本。"
        }
    ]

    var current = msg;

    while(current && messages.length < maxMessages){
        if(current.text){
            const isUser = current.from.id === msg.from.id;
            messages.splice(1, 0, {
                role: isUser ? "user" : "assistant",
                content: current.text
            });
        }

        current = current.reply_to_message;
    }
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: messages,
    });

    const reply = completion.choices[0].message.content;

    bot.sendMessage(msg.chat.id, reply, { reply_to_message_id: msg.message_id });

}
