import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import generate_answer_for_boss from "../lib/generate_answer.js";
import start_daily_job from "../lib/daily_generation.js";
import safeReply from "../helper/trim_length.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config(); // Loads TOKEN from .env into process.env

app.get("/", (req, res) => {
  res.send("BOT IS RUNNING");
});

app.listen(8000, () => {
  console.log("SERVER RUNNING........");
});

// Create client (your bot instance) with required permissions (intents)
// basically boiler plate setup for discord bot
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Needed for basic server connection
    GatewayIntentBits.GuildMessages, // Needed to receive messages from servers
    GatewayIntentBits.MessageContent, // Needed to read actual message text (e.g., "ping")
  ],
});

// Runs once when bot successfully connects to Discord
bot.once("clientReady", () => {
  console.log(`✅ Bot is online...`);

  start_daily_job(bot);
});

// Runs every time a message is created in a server
bot.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Prevent bot from replying to bots (including itself)

  // Check if bot is mentioned
  if (!message.mentions.users.has(bot.user.id)) return;

  // DETECT Dev Asking Anything!
  if (message.author.id == process.env.BOSS_ID) {
    try {
      await message.channel.sendTyping();

      const text = await generate_answer_for_boss(message.content);
      await message.reply(safeReply(text));
    } catch (error) {
      console.log(error.message);
      await message.reply("I Couldn't Deliver My Response For some reason!!");
    }
  } else {
    await message.reply("Don't Order Me Around!😏");
  }
});

// Logs in using your bot token (establishes connection to Discord)
bot.login(process.env.TOKEN);
