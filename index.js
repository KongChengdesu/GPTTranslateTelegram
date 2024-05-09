require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const OAI = require('openai');
const OpenAI = OAI.OpenAI;
const DetectLanguage = require('detectlanguage');
const detectLanguage = new DetectLanguage(process.env.DETECTLANGUAGE_API_KEY);

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

async function isChinese(text){

    const result = await detectLanguage.detect(text);

    return result[0].language === "zh" || result[0].language === "zh-Hant";

}

const chinesePrompt = "Traduza os textos de entrada do usuário para chinês, baseado no contexto anterior. Você está respondendo clientes da sua loja de câmera de segurança. Seja formal. Sua resposta deve conter apenas o texto traduzido.";

const portuguesePrompt = "基于之前的内容，把用户输入的文本翻译成中文";

async function translateReply(msg){

    const isChineseText = await isChinese(msg.text);
    
    var messages = [
        {
            role: "system",
            content: isChineseText ? chinesePrompt : portuguesePrompt
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
