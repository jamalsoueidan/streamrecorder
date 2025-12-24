import { factories } from "@strapi/strapi";
import crypto from "crypto";

export default factories.createCoreController(
  "api::change-log.change-log",
  ({ strapi }) => ({
    async handleGithubWebhook(ctx) {
      const signature = ctx.request.headers["x-hub-signature-256"] as string;
      const event = ctx.request.headers["x-github-event"] as string;

      if (event !== "release") {
        return ctx.send({ message: "ignored" }, 200);
      }

      const secret = process.env.GITHUB_WEBHOOK_SECRET;
      const rawBody = JSON.stringify(ctx.request.body);
      const digest =
        "sha256=" +
        crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

      if (signature !== digest) {
        return ctx.send({ error: "Invalid signature" }, 401);
      }

      const { action, release } = ctx.request.body;

      if (action !== "published") {
        return ctx.send({ message: "ignored" }, 200);
      }

      const result = await strapi
        .documents("api::change-log.change-log")
        .create({
          data: {
            version: release.tag_name,
            body: release.body,
          },
          status: "published",
        });

      return ctx.send({ message: "ok", version: release.tag_name });
    },
  })
);
