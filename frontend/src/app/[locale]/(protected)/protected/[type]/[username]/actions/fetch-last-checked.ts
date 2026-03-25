"use server";

const RECORDSTREAM_URL = "https://strapi.recordstream.app/api";
const RECORDSTREAM_TOKEN =
  "0a256cd2c638834c501fe2feb0a9563a0ea3ba8da110f0710fc8c1bcbbe37c0441bff0f0f39c866feb9a03d1927e6db24b57af320e89b362b83d90b498b9250ee5c365ed98dc65355600f903605ad5379ef6955f870827df665b17f29e614bbdce46e5fc07dbe4b79da2a9cd6b0f3af5a562bfe7c95b85de41695dca6dbe9c78";

export async function fetchLastChecked(username: string, type: string) {
  try {
    const params = new URLSearchParams({
      "filters[username][$eq]": username,
      "filters[type][$eq]": type,
      "fields[0]": "lastCheckedAt",
      "pagination[limit]": "1",
    });

    const res = await fetch(`${RECORDSTREAM_URL}/followers?${params}`, {
      headers: {
        Authorization: `Bearer ${RECORDSTREAM_TOKEN}`,
      },
      cache: "no-store",
    });

    const json = await res.json();
    const lastCheckedAt = json.data?.[0]?.lastCheckedAt;
    return { lastCheckedAt };
  } catch {
    return { lastCheckedAt: null };
  }
}
