import * as dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import { translateReply } from './textTranslate';
import { handleReceivedImage } from './imageAnswer';
import { handleReceivedAudio } from './speechTranslate';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('polling_error', (error) => {
    console.log(error);  // => 'EFATAL'
});

bot.on('message',async (msg) => {
    
    if(!msg.text){
        return;
    }

    console.log(msg);

    await bot.sendMessage(msg.chat.id, await translateReply(msg), {
        reply_to_message_id: msg.message_id
    }).catch((error) => {
        console.error('Error sending message:', error);
    });

});

bot.on('photo', async (msg) => {
    console.log(`Photo received: ${msg.photo[msg.photo.length - 1].file_id}`);
    // get image url
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;

    await bot.sendMessage(msg.chat.id, await handleReceivedImage(msg, fileUrl), {
        reply_to_message_id: msg.message_id
    }).catch((error) => {
        console.error('Error sending message:', error);
    });

});

bot.on('audio', async (msg) => {
    console.log(`Audio received: ${msg.audio.file_id}`);
    // get audio url
    const fileId = msg.audio.file_id;
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;

    await bot.sendMessage(msg.chat.id, await handleReceivedAudio(msg, fileUrl), {
        reply_to_message_id: msg.message_id
    }).catch((error) => {
        console.error('Error sending message:', error);
    });

});

bot.on('voice', async (msg) => {
    console.log(`Voice received: ${msg.voice.file_id}`);
    // get audio url
    const fileId = msg.voice.file_id;
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;

    await bot.sendMessage(msg.chat.id, await handleReceivedAudio(msg, fileUrl), {
        reply_to_message_id: msg.message_id
    }).catch((error) => {
        console.error('Error sending message:', error);
    });

});

bot.on('document', async (msg) => {
    console.log(`Document received: ${msg.document.file_id}`);
    // get audio url
    const fileId = msg.document.file_id;
    const file = await bot.getFile(fileId);
    const filePath = file.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${filePath}`;

    await bot.sendMessage(msg.chat.id, await handleReceivedAudio(msg, fileUrl), {
        reply_to_message_id: msg.message_id
    }).catch((error) => {
        console.error('Error sending message:', error);
    });

});