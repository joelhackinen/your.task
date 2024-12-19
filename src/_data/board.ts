import { unstable_cache } from "next/cache";

export const getCards = unstable_cache(async () => {
  
}, [], { tags: ["cards"]});