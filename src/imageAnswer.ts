import { Message } from "node-telegram-bot-api";
import { createWorker } from "tesseract.js";
import axios from "axios";
import sharp from 'sharp';

import { openai } from "./openai";

export async function handleReceivedImage(msg: Message, fileUrl: string): Promise<string> {

    if(!msg.photo) {
        return;
    }

    const imageDownload = await axios.get(fileUrl, { responseType: 'arraybuffer' });

    const imageBuffer = Buffer.from(imageDownload.data, 'binary');
    const image = sharp(imageBuffer)
        .resize({ width: 720 });
    
    // Crop the image 
    const croppedImage = image
        .extract({ left: 0, top: 70, width: 720 ,height: 180 }) 
        .toBuffer();


}

async function getProdName(image) {

    

}