export async function GET() {
  return Response.json({ buildId: process.env.NEXT_PUBLIC_BUILD_ID });
}
