"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useInvalidateRecordings() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["following"] });
    queryClient.invalidateQueries({ queryKey: ["explore"] });
    queryClient.invalidateQueries({ queryKey: ["creators", "mylist"] });
  }, [queryClient]);
}
