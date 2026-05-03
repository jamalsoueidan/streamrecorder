import { getFollowerFilters } from "@/app/actions/followers";
import Filters from "./filters";

export async function FiltersWrapper() {
  const filterOptions = await getFollowerFilters();
  return <Filters filterOptions={filterOptions} />;
}
