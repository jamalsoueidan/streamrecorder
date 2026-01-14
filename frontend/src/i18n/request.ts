import fs from "fs";
import { getRequestConfig } from "next-intl/server";
import path from "path";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messagesDir = path.join(process.cwd(), "src", "messages", locale);
  const files = fs.readdirSync(messagesDir).filter((f) => f.endsWith(".json"));

  const messages = Object.fromEntries(
    await Promise.all(
      files.map(async (file) => {
        const name = file.replace(".json", "");
        const content = (await import(`../messages/${locale}/${file}`)).default;
        return [name, content];
      })
    )
  );

  return {
    locale,
    messages,
  };
});
