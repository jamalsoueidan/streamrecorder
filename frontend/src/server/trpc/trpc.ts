import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";

export const createContext = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers });
  return { db, user: session?.user ?? null };
};

export const createServerContext = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return { db, user: session?.user ?? null };
};

const t = initTRPC
  .context<Awaited<ReturnType<typeof createContext>>>()
  .create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
