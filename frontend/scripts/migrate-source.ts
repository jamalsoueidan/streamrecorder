import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function migrateVideos() {
  // Migrate videoOriginal
  await db.execute(sql`
    UPDATE sources s
    SET
      video_original_playlist = cv.playlist,
      video_original_width = cv.width,
      video_original_height = cv.height,
      video_original_size = cv.size_bytes
    FROM sources_cmps sc
    JOIN components_videos_videos cv ON cv.id = sc.cmp_id
    WHERE sc.entity_id = s.id AND sc.field = 'videoOriginal'
  `);

  // Migrate videoSmall
  await db.execute(sql`
    UPDATE sources s
    SET
      video_small_playlist = cv.playlist,
      video_small_width = cv.width,
      video_small_height = cv.height,
      video_small_size = cv.size_bytes
    FROM sources_cmps sc
    JOIN components_videos_videos cv ON cv.id = sc.cmp_id
    WHERE sc.entity_id = s.id AND sc.field = 'videoSmall'
  `);

  console.log("Done!");
  process.exit(0);
}

migrateVideos().catch(console.error);
