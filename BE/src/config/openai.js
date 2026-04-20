const { default: OpenAI } = require("openai");
const { env } = require("./env");

let openaiClient = null;

const getOpenAIClient = () => {
  if (openaiClient) {
    return openaiClient;
  }

  openaiClient = new OpenAI({
    baseURL: env.openai.baseUrl,
    apiKey: env.openai.apiKey,
    timeout: 10000,
  });

  return openaiClient;
};

module.exports = { getOpenAIClient };
