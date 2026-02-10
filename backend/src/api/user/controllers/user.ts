export default {
  async update(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const { username } = ctx.request.body;

    if (!username || typeof username !== "string") {
      return ctx.badRequest("Username is required");
    }

    const trimmed = username.trim();

    if (trimmed.length < 3 || trimmed.length > 30) {
      return ctx.badRequest("Username must be between 3 and 30 characters");
    }

    // Check if username is already taken by another user
    const existing = await strapi
      .documents("plugin::users-permissions.user")
      .findFirst({
        filters: {
          username: { $eqi: trimmed },
          documentId: { $ne: user.documentId },
        },
      });

    if (existing) {
      return ctx.badRequest("Username is already taken");
    }

    // Update the user
    const updated = await strapi
      .documents("plugin::users-permissions.user")
      .update({
        documentId: user.documentId,
        data: { username: trimmed },
      });

    return {
      data: {
        id: updated.id,
        documentId: updated.documentId,
        username: updated.username,
        email: updated.email,
      },
    };
  },

  async destroy(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    // Delete the user (Strapi should cascade the link table)
    await strapi.documents("plugin::users-permissions.user").delete({
      documentId: user.documentId,
    });

    return { success: true };
  },
};
