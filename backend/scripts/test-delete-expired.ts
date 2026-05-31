/**
 * Local DRY-RUN tester for deleteExpiredSources cron.
 *
 * Connects to the same DB + S3 the backend uses (via backend/.env),
 * pulls the same expired rows the cron would pull, runs the safety
 * validator on each, and lists how many S3 keys would be deleted —
 * WITHOUT actually deleting anything.
 *
 * Usage:
 *   cd backend
 *   yarn tsx scripts/test-delete-expired.ts          # 10 rows
 *   yarn tsx scripts/test-delete-expired.ts 50       # 50 rows
 */
import {
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import "dotenv/config";
import knexLib from "knex";

const LIMIT = Number(process.argv[2] ?? 10);

function assertSafe(bucket: string, path: string) {
  if (!bucket || !bucket.startsWith("streamrecorder-")) {
    throw new Error(`unsafe bucket: ${JSON.stringify(bucket)}`);
  }
  if (!path || typeof path !== "string") {
    throw new Error(`unsafe path: ${JSON.stringify(path)}`);
  }
  if (!path.startsWith("/") || !path.endsWith("/")) {
    throw new Error(`unsafe path (must start+end with /): ${path}`);
  }
  if (path.length < 10) {
    throw new Error(`unsafe path (too short): ${path}`);
  }
  if (path.split("/").filter(Boolean).length < 3) {
    throw new Error(`unsafe path (need >= 3 segments): ${path}`);
  }
}

async function main() {
  const knex = knexLib({
    client: "pg",
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT ?? 5432),
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
  });

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
  });

  const { rows: expired } = (await knex.raw(`
    SELECT id, bucket, path, created_at
    FROM sources
    WHERE created_at < NOW() - INTERVAL '30 days'
      AND bucket IS NOT NULL
      AND path IS NOT NULL
    ORDER BY created_at
    LIMIT ?
  `, [LIMIT])) as {
    rows: Array<{ id: number; bucket: string; path: string; created_at: Date }>;
  };

  console.log(`Pulled ${expired.length} expired rows.\n`);

  let safe = 0;
  let unsafe = 0;
  let totalKeys = 0;

  for (const src of expired) {
    try {
      assertSafe(src.bucket, src.path);
    } catch (err) {
      unsafe++;
      console.log(`UNSAFE id=${src.id}: ${(err as Error).message}`);
      continue;
    }

    const prefix = src.path.replace(/^\//, "");
    let keys = 0;
    let token: string | undefined;
    try {
      do {
        const list = await s3.send(
          new ListObjectsV2Command({
            Bucket: src.bucket,
            Prefix: prefix,
            ContinuationToken: token,
          }),
        );
        keys += list.Contents?.length ?? 0;
        token = list.IsTruncated ? list.NextContinuationToken : undefined;
      } while (token);
    } catch (err) {
      console.log(
        `S3 ERR id=${src.id} ${src.bucket}/${prefix}: ${(err as Error).message}`,
      );
      continue;
    }

    safe++;
    totalKeys += keys;
    console.log(
      `OK   id=${src.id} ${src.bucket}/${prefix} → would delete ${keys} keys`,
    );
  }

  console.log(`\n---`);
  console.log(`Safe: ${safe} / Unsafe: ${unsafe}`);
  console.log(`Total keys that WOULD be deleted: ${totalKeys}`);
  console.log(`(No deletions performed.)`);

  await knex.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
