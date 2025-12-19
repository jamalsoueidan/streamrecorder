import api from "@/app/api";

export async function GET() {
  try {
    const navigation = await api.navigation.getNavigation({
      populate: "links",
    });

    return Response.json(navigation.data.data);
  } catch (error) {
    console.error("Navigation error:", error);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
