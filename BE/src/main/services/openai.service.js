const { env } = require("../../config/env");
const { getOpenAIClient } = require("../../config/openai");
const logger = require("../../utils/logger");
const { sleep } = require("../../utils/validationAndCalculations");

const callAI = async (fn, retries = 2, meta = {}) => {
  const client = getOpenAIClient();
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await Promise.race([
        fn(client),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("AI timeout")), 10000),
        ),
      ]);
    } catch (err) {
      lastError = err;

      logger.warn("AI attempt failed", {
        attempt,
        message: err.message,
        requestId: meta.requestId,
      });

      if (attempt < retries) {
        await sleep((attempt + 1) * 1000);
      }
    }
  }

  throw new Error(`AI failed: ${lastError?.message}`);
};

const chatCompletion = async (prompt, options = {}, meta = {}) => {
  const {
    model = env.openai.model,
    maxTokens = 2000,
    temperature = 0.7,
    systemPrompt = "You are a certified Indian nutritionist and fitness trainer. Always respond with valid JSON only — no markdown, no explanation.",
  } = options;

  const response = await callAI(
    (client) =>
      client.responses.create({
        model,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_output_tokens: maxTokens,
        temperature,
      }),
    options.retries,
    meta,
  );

  const content = response.output_text?.trim();
  const usage = response.usage;

  logger.debug("OpenAI usage", {
    promptTokens: usage?.input_tokens,
    completionTokens: usage?.output_tokens,
    requestId: meta.requestId,
  });

  return { content, usage };
};

const safeJSONParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const chatCompletionJSON = async (prompt, options = {}, meta = {}) => {
  const { content } = await chatCompletion(prompt, options, meta);

  const cleaned = content
    ?.replace(/^```(?:json)?\s*/i, "")
    ?.replace(/\s*```$/, "")
    ?.trim();

  let parsed = safeJSONParse(cleaned);

  if (!parsed) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) parsed = safeJSONParse(match[0]);
  }

  if (!parsed) {
    logger.error("AI JSON parse failed", {
      preview: cleaned?.substring(0, 200),
      requestId: meta.requestId,
    });

    throw new Error("AI returned invalid response");
  }

  return parsed;
};

module.exports = { chatCompletion, chatCompletionJSON };
