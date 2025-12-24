async function fetchTikTokProfile(username: string) {
  const cleanUsername = username.replace("@", "");

  try {
    const response = await fetch(
      `https://tiktok-api-proxy-secure-1547345324345.issam1996kech.workers.dev/?username=${cleanUsername}`
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("TikTok fetch error:", error);
    return null;
  }
}

async function downloadAndUploadAvatar(avatarUrl: string, username: string) {
  try {
    const response = await fetch(avatarUrl);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const filename = `${username}-avatar.jpg`;
    const hash = `${username}_avatar_${Date.now()}`;

    const fileData: any = {
      name: filename,
      alternativeText: `${username} TikTok avatar`,
      caption: null,
      hash: hash,
      ext: ".jpg",
      mime: "image/jpeg",
      size: buffer.length / 1000,
      buffer: buffer,
    };

    // Upload to provider (writes file to disk/S3)
    await strapi.plugin("upload").provider.upload(fileData);

    // Save to database
    const uploadedFile = await strapi.db.query("plugin::upload.file").create({
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

    return uploadedFile?.id || null;
  } catch (error) {
    console.error("Avatar upload error:", error);
    return null;
  }
}

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data?.username && data?.type === "tiktok") {
      const profile: any = await fetchTikTokProfile(data.username);

      if (profile?.profile) {
        event.params.data.country = profile.profile.Country || null;
        event.params.data.language = profile.profile.Language || null;

        if (profile.profile["Avatar URL"]) {
          const avatarId = await downloadAndUploadAvatar(
            profile.profile["Avatar URL"],
            data.username.replace("@", "")
          );

          if (avatarId) {
            event.params.data.avatar = avatarId;
          }
        }
      }
    }
  },
};
