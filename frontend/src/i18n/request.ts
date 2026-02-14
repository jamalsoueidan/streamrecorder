import fs from "fs";
import { getRequestConfig } from "next-intl/server";
import path from "path";
import { routing } from "./routing";

// Cache messages per locale - only load once
const messagesCache: Record<string, Record<string, any>> = {};

function loadMessagesRecursively(dir: string): Record<string, any> {
  const messages: Record<string, any> = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nestedMessages = loadMessagesRecursively(fullPath);
      messages[entry.name] = nestedMessages;
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      const name = entry.name.replace(".json", "");
      const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      messages[name] = content;
    }
  }

  return messages;
}

function getMessages(locale: string): Record<string, any> {
  if (!messagesCache[locale]) {
    const messagesDir = path.join(process.cwd(), "src", "messages", locale);
    messagesCache[locale] = loadMessagesRecursively(messagesDir);
  }
  return messagesCache[locale];
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: getMessages(locale),
  };
});
