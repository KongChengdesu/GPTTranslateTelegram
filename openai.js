const OAI = require('openai');
const OpenAI = OAI.OpenAI;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = {
    openai
};