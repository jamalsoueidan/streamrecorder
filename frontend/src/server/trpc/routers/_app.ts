import { router } from "../trpc";
import { followersRouter } from "./followers";

export const appRouter = router({
  followers: followersRouter,
});

export const createCaller = appRouter.createCaller;
export type AppRouter = typeof appRouter;
