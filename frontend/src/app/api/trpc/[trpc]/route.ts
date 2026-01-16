import { appRouter } from "@/server/trpc/routers/_app";
import { createContext } from "@/server/trpc/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: ({ error, path }) => {
      console.error(`❌ tRPC error on '${path}':`, error);
    },
  });

export { handler as GET, handler as POST };
