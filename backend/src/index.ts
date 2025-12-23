export default {
  register() {},

  async bootstrap({ strapi }) {
    // Run once - backfill existing followers
    const followers = await strapi.db.query("api::follower.follower").findMany({
      where: {
        country: null,
      },
    });

    console.log(
      `[Backfill] Found ${followers.length} followers without country`
    );

    for (const follower of followers) {
      if (!follower.username) continue;

      try {
        const cleanUsername = follower.username.replace("@", "");
        const response = await fetch(
          `https://tiktok-api-proxy-secure-1547345324345.issam1996kech.workers.dev/?username=${cleanUsername}`
        );

        if (!response.ok) continue;

        const profile: any = await response.json();

        if (profile?.profile) {
          const updateData: any = {
            country: profile.profile.Country || null,
            language: profile.profile.Language || null,
          };

          // Upload avatar
          if (profile.profile["Avatar URL"]) {
            const avatarResponse = await fetch(profile.profile["Avatar URL"]);
            if (avatarResponse.ok) {
              const buffer = Buffer.from(await avatarResponse.arrayBuffer());
              const hash = `${cleanUsername}_avatar_${Date.now()}`;

              const fileData: any = {
                name: `${cleanUsername}-avatar.jpg`,
                alternativeText: `${cleanUsername} TikTok avatar`,
                caption: null,
                hash: hash,
                ext: ".jpg",
                mime: "image/jpeg",
                size: buffer.length / 1000,
                buffer: buffer,
              };

              await strapi.plugin("upload").provider.upload(fileData);

              const uploadedFile = await strapi.db
                .query("plugin::upload.file")
                .create({
                  data: {
                    name: fileData.name,
                    alternativeText: fileData.alternativeText,
                    caption: fileData.caption,
                    hash: fileData.hash,
                    ext: fileData.ext,
                    mime: fileData.mime,
                    size: fileData.size,
                    url: fileData.url,
                    provider: "local",
                  },
                });

              if (uploadedFile?.id) {
                updateData.avatar = uploadedFile.id;
              }
            }
          }

          await strapi.db.query("api::follower.follower").update({
            where: { id: follower.id },
            data: updateData,
          });

          console.log(
            `[Backfill] Updated: ${follower.username} - ${profile.profile.Country}`
          );
        }
      } catch (error) {
        console.error(`[Backfill] Error for ${follower.username}:`, error);
      }
    }

    console.log("[Backfill] Done");
  },
};
