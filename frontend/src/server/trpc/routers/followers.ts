import { userFollowers } from "@/db/schema/auth-schema";
import { followers, recordings, sources } from "@/db/schema/schema";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const followersRouter = router({
  browse: protectedProcedure
    .input(
      z.object({
        scope: z.enum(["following", "discover"]).optional(),
        hasRecordings: z.boolean().optional(),
        sort: z.string().optional(),
        pageSize: z.number().default(25),
        cursor: z.number().nullish(),
        filters: z
          .object({
            country: z.string().optional(),
            countryCode: z.string().optional(),
            language: z.string().optional(),
            languageCode: z.string().optional(),
            gender: z.string().optional(),
            type: z.string().optional(),
            search: z.string().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { scope, hasRecordings, sort, pageSize, filters } = input;
      const page = input.cursor ?? 1;
      const offset = (page - 1) * pageSize;
      const includeRecordings = scope === "discover";

      // Get user's following IDs
      const following = await ctx.db
        .select({ followerId: userFollowers.followerId })
        .from(userFollowers)
        .where(eq(userFollowers.userId, ctx.user.id));

      const followingIds = following.map((f) => f.followerId);

      if (scope === "following" && followingIds.length === 0) {
        return {
          data: [],
          meta: { pagination: { page, pageSize, pageCount: 0, total: 0 } },
        };
      }

      // Build conditions
      const conditions = [];
      if (scope === "following" && followingIds.length > 0) {
        conditions.push(inArray(followers.id, followingIds));
      } else if (scope === "discover" && followingIds.length > 0) {
        conditions.push(notInArray(followers.id, followingIds));
      }
      if (filters?.country)
        conditions.push(eq(followers.country, filters.country));
      if (filters?.countryCode)
        conditions.push(eq(followers.countryCode, filters.countryCode));
      if (filters?.language)
        conditions.push(eq(followers.language, filters.language));
      if (filters?.languageCode)
        conditions.push(eq(followers.languageCode, filters.languageCode));
      if (filters?.gender)
        conditions.push(eq(followers.gender, filters.gender));
      if (filters?.type) conditions.push(eq(followers.type, filters.type));
      if (filters?.search) {
        conditions.push(
          or(
            ilike(followers.username, `%${filters.search}%`),
            ilike(followers.nickname, `%${filters.search}%`)
          )
        );
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Query 1: Followers with stats
      const result = await ctx.db
        .select({
          follower: followers,
          totalRecordings: sql<number>`count(distinct case when ${sources.state} != 'failed' then ${recordings.id} end)`,
          latestRecording: sql<string>`max(case when ${sources.state} != 'failed' then ${recordings.createdAt} end)`,
        })
        .from(followers)
        .leftJoin(recordings, eq(recordings.followerId, followers.id))
        .leftJoin(sources, eq(sources.recordingId, recordings.id))
        .where(whereClause)
        .groupBy(followers.id)
        .having(
          hasRecordings
            ? sql`count(distinct case when ${sources.state} != 'failed' then ${recordings.id} end) > 0`
            : undefined
        )
        .orderBy(
          sort === "totalRecordings:desc"
            ? desc(
                sql`count(distinct case when ${sources.state} != 'failed' then ${recordings.id} end)`
              )
            : sort === "totalRecordings:asc"
            ? asc(
                sql`count(distinct case when ${sources.state} != 'failed' then ${recordings.id} end)`
              )
            : sort === "latestRecording:desc"
            ? desc(
                sql`max(case when ${sources.state} != 'failed' then ${recordings.createdAt} end)`
              )
            : sort === "latestRecording:asc"
            ? asc(
                sql`max(case when ${sources.state} != 'failed' then ${recordings.createdAt} end)`
              )
            : sort === "username:desc"
            ? desc(followers.username)
            : sort === "username:asc"
            ? asc(followers.username)
            : desc(followers.createdAt)
        )
        .limit(pageSize)
        .offset(offset);

      // Count query
      const countResult = await ctx.db
        .select({ total: sql<number>`count(distinct ${followers.id})` })
        .from(followers)
        .leftJoin(recordings, eq(recordings.followerId, followers.id))
        .leftJoin(sources, eq(sources.recordingId, recordings.id))
        .where(whereClause)
        .having(
          hasRecordings
            ? sql`count(distinct case when ${sources.state} != 'failed' then ${recordings.id} end) > 0`
            : undefined
        );

      const total = countResult[0]?.total || 0;
      const followerIds = result.map((r) => r.follower.id);

      // Query 2: Top 5 recordings per follower using ROW_NUMBER
      const recordingsMap = new Map<
        number,
        {
          recording: typeof recordings.$inferSelect;
          source: typeof sources.$inferSelect;
        }[]
      >();

      if (includeRecordings && followerIds.length > 0) {
        const recordingsWithSources = await ctx.db
          .select({
            recordingId: recordings.id,
            recordingFollowerId: recordings.followerId,
            recordingCreatedAt: recordings.createdAt,
            source: sources,
            rowNum:
              sql<number>`ROW_NUMBER() OVER (PARTITION BY ${recordings.followerId} ORDER BY ${recordings.createdAt} DESC)`.as(
                "row_num"
              ),
          })
          .from(recordings)
          .innerJoin(sources, eq(sources.recordingId, recordings.id))
          .where(
            and(
              inArray(recordings.followerId, followerIds),
              ne(sources.state, "failed")
            )
          );

        // Filter top 5 in JS
        for (const row of recordingsWithSources) {
          if (row.rowNum > 5) continue;
          const fId = row.recordingFollowerId!;
          if (!recordingsMap.has(fId)) recordingsMap.set(fId, []);
          recordingsMap.get(fId)!.push(row);
        }
      }

      const data = result.map((row) => ({
        ...row.follower,
        totalRecordings: Number(row.totalRecordings),
        latestRecording: row.latestRecording,
        isFollowing: followingIds.includes(row.follower.id),
        recordings: recordingsMap.get(row.follower.id) || [],
      }));

      return {
        data,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
            total,
          },
        },
      };
    }),
});
