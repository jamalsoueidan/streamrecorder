import { account, user, userFollowers } from "@/db/schema/auth-schema";
import { upUsers, upUsersFollowersLnk } from "@/db/schema/schema";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

async function migrateUsers() {
  const strapiUsers = await db.select().from(upUsers);

  console.log(`Migrating ${strapiUsers.length} users...`);

  for (const su of strapiUsers) {
    const userId = randomUUID();

    await db.insert(user).values({
      id: userId,
      name: su.username || "",
      email: su.email || "",
      emailVerified: su.confirmed || false,
      createdAt: su.createdAt ? new Date(su.createdAt) : new Date(),
      updatedAt: su.updatedAt ? new Date(su.updatedAt) : new Date(),
    });

    await db.insert(account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId: userId,
      password: su.password?.replace("$2a$", "$2b$"),
      createdAt: su.createdAt ? new Date(su.createdAt) : new Date(),
      updatedAt: su.updatedAt ? new Date(su.updatedAt) : new Date(),
    });

    // Migrate follower relationships
    const followerLinks = await db
      .select()
      .from(upUsersFollowersLnk)
      .where(eq(upUsersFollowersLnk.userId, su.id));
    for (const link of followerLinks) {
      if (link.followerId) {
        await db.insert(userFollowers).values({
          id: randomUUID(),
          userId: userId,
          followerId: link.followerId,
        });
      }
    }

    console.log(`Migrated: ${su.email} (${followerLinks.length} followers)`);
  }

  console.log("Done!");
  process.exit(0);
}

migrateUsers().catch(console.error);
