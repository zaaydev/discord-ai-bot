// trim length
export default function safeReply(text, max = 2000) {
  if (!text) return "Empty response 😢";

  if (text.length <= max) return text;

  return text.slice(0, max - 3) + "...";
}