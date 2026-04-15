import { google } from "@ai-sdk/google";
// api key name in env should be GOOGLE_GENERATIVE_AI_API_KEY
import { generateText } from "ai";

async function generate_answer_for_boss(question) {
  const boss_prompt = cook_solid_prompt(question);

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"), // ✅ FIXED
      prompt: boss_prompt,
      maxTokens: 300,
    });

    return text;
  } catch (error) {
    console.error(error.message);
    return "Your AI API failed 😢";
  }
}

export default generate_answer_for_boss;

// trim response if length is more than 2000 chars coz we cant send that big response to discord
function safeReply(text, max = 2000) {
  if (!text) return "Empty response 😢";

  if (text.length <= max) return text;

  return text.slice(0, max - 3) + "...";
}

function cook_solid_prompt(question) {
  const prompt = `
Answer the following question clearly and correctly BUT NOTE THAT YOUR RESPONSE LENGTH SHOULD NOT BE MORE THAN 2000 CHARACTERS:
"${question}"

Rules:
- Keep the answer short and simple.
- Keep the total response under 2000 characters.
- Avoid unnecessary details unless required.
- don't give me code pallate more than 4 lines, whole code. if code is needed to explain then use only two to four lines of code otherwise don't return

REMINDER: YOUR RESPONSE LENGTH SHOULD NOT BE MORE THAN 2000 CHARACTERS or my app will crash
`;

  return prompt;
}
