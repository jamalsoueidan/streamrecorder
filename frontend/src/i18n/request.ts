import fs from "fs";
import { getRequestConfig } from "next-intl/server";
import path from "path";
import { routing } from "./routing";

function loadMessagesRecursively(
  dir: string,
  basePath: string = "",
): Record<string, any> {
  const messages: Record<string, any> = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively load nested folder
      const nestedMessages = loadMessagesRecursively(fullPath, entry.name);
      messages[entry.name] = nestedMessages;
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      // Load JSON file
      const name = entry.name.replace(".json", "");
      const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      messages[name] = content;
    }
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messagesDir = path.join(process.cwd(), "src", "messages", locale);
  const messages = loadMessagesRecursively(messagesDir);

  return {
    locale,
    messages,
  };
});
