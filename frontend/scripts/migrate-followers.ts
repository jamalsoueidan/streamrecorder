import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function migrateSchema() {
  // Copy data from junction tables
  await db.execute(sql`
    UPDATE recordings r
    SET follower_id = lnk.follower_id
    FROM recordings_follower_lnk lnk
    WHERE lnk.recording_id = r.id
  `);

  await db.execute(sql`
    UPDATE sources s
    SET recording_id = lnk.recording_id
    FROM recordings_sources_lnk lnk
    WHERE lnk.source_id = s.id
  `);

  // Copy avatar URLs
  await db.execute(sql`
    UPDATE followers f
    SET avatar_url = files.url
    FROM files
    JOIN files_related_mph frm ON files.id = frm.file_id
    WHERE frm.related_type = 'api::follower.follower'
    AND frm.field = 'avatar'
    AND frm.related_id = f.id
  `);

  console.log("Done!");
  process.exit(0);
}

migrateSchema().catch(console.error);
