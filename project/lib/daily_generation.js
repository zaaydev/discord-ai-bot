import cron from "node-cron";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const daily_prompt = `
You are a senior software engineer.

Generate exactly 2 interview questions:

1. One simple MERN backend question for fresher
2. One simple system design question for fresher

Rules:
- Keep both questions concise
- Include a short hint for each
- just questions nothing else so overall small response (max character limit 1500). 
- use suitable emojies to make it look less boring

Format STRICTLY:

MERN:
Question: ...
Hint: ...

SYSTEM DESIGN:
Question: ...
Hint: ...
`;

export default function start_daily_job(bot) {
  cron.schedule(
    "0 8 * * *", // ⏰ 8 AM daily
    async () => {
      console.log("⏰ Running daily question job...");

      try {
        // get that channel where bot should send message
        const channel = await bot.channels.fetch(process.env.DAILY_CHANNEL_ID);

        if (!channel) {
          console.error("Channel not found");
          return;
        }

        const { text } = await generateText({
          model: google("gemini-2.5-flash"), // ✅ FIXED
          prompt: daily_prompt,
        });
        await channel.send(`**Daily Interview Questions**\n\n${text}`);
      } catch (err) {
        console.error("Daily cron error:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
}
