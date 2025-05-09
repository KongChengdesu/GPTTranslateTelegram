import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import axios from 'axios';
import { Message } from 'node-telegram-bot-api';
import { ChatCompletionMessageParam } from 'openai/resources';
import { openai } from './openai';

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, process.env.AZURE_SPEECH_REGION);
speechConfig.speechRecognitionLanguage = process.env.AZURE_SPEECH_LANGUAGE || 'pt-BR';

const audioPrompt = "把下列信息翻译成中文，这些信息是根据语音识别得来的，可能会有错误，请纠正这些错误";

async function speechToText(audioFilePath: string): Promise<string> {

    return new Promise((resolve, reject) => {
        const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioFilePath));
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync((result) => {
            if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                resolve(result.text);
            } else {
                reject(new Error(`Error recognizing speech: ${result.reason}`));
            }
            recognizer.close();
        });
    });
    
}

export async function handleReceivedAudio(msg: Message, fileUrl: string): Promise<string> 
{
    const audioDownload = await axios.get(fileUrl, { responseType: 'arraybuffer' });

    const audioBuffer = Buffer.from(audioDownload.data, 'binary');
    const audioFilePath = path.join(__dirname,"..","download", 'audio.wav');
    fs.writeFileSync(audioFilePath, audioBuffer);
    const text = await speechToText(audioFilePath);
    fs.unlinkSync(audioFilePath);

    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: audioPrompt
        }
    ]

    messages.push({
        role: "user",
        content: text
    });

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: messages,
    });

    const reply = completion.choices[0].message.content;
    return reply;

}