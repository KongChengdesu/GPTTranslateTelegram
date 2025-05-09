import { Message } from "node-telegram-bot-api";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const chinesePrompt = "Traduza os textos de entrada do usuário para português, baseado no contexto anterior. Sua resposta deve conter apenas o texto traduzido.";
const portuguesePrompt = "基于之前的内容，把用户输入的文本翻译成中文";

const maxMessages = 4;

import { openai } from "./openai";
import { isChinese } from "./utils";

export async function translateReply(msg: Message): Promise<string> {

    console.log(`Translating message: ${msg.text}`);

    const isChineseText = isChinese(msg.text);
    
    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: isChineseText ? chinesePrompt : portuguesePrompt
        }
    ]

    let current = msg;

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
