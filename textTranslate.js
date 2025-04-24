const chinesePrompt = "Traduza os textos de entrada do usuário para português, baseado no contexto anterior. Sua resposta deve conter apenas o texto traduzido.";
const portuguesePrompt = "基于之前的内容，把用户输入的文本翻译成中文";

const maxMessages = 4;

const { openai } = require("./openai.js");
const { isChinese } = require("./utils.js");

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
        model: "gpt-4.1-nano",
        messages: messages,
    });

    const reply = completion.choices[0].message.content;

    return reply;

}

module.exports = {
    translateReply
};