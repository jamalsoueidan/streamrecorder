import {
  createSearchParamsCache,
  inferParserType,
  parseAsStringEnum,
} from "nuqs/server";

export enum SortOptions {
  createdAtDesc = "createdAt:desc",
  createdAtAsc = "createdAt:asc",
}

export const profileParsers = {
  sort: parseAsStringEnum<SortOptions>(Object.values(SortOptions)).withDefault(
    SortOptions.createdAtDesc
  ),
};

export const profileParamsCache = createSearchParamsCache(profileParsers);

export type ProfileFilters = inferParserType<typeof profileParsers>;
