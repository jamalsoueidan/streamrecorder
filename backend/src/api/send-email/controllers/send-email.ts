export default {
  async send(ctx) {
    const { name, email, subject, message } = ctx.request.body;

    if (!email || !message) {
      return ctx.badRequest("Missing required fields");
    }

    const emailSettings = strapi.plugin("email").config("settings") as {
      defaultTo?: string;
    };

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: emailSettings.defaultTo,
          to: emailSettings.defaultTo,
          subject: subject || `Contact form: ${name || "No name"}`,
          html: `
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject || "N/A"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
          reply_to: email,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        strapi.log.error("Resend error:", error);
        return ctx.internalServerError("Failed to send email");
      }

      return ctx.send({ message: "Email sent successfully" });
    } catch (error) {
      strapi.log.error("Email send error:", error);
      return ctx.internalServerError("Failed to send email");
    }
  },
};
