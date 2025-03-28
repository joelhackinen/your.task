import { createNeonClient } from "./clients/neon";
import { createPostgresJsClient } from "./clients/postgresjs";

declare global {
  // eslint-disable-next-line no-var
  var cachedDbClient: ReturnType<typeof createPostgresJsClient> | undefined;
}

const isDeployment = !!process.env.FLY_APP_NAME;

if (!isDeployment) {
  globalThis.cachedDbClient ??= createPostgresJsClient();
}

export const db = isDeployment
  ? createNeonClient()
  : globalThis.cachedDbClient!;
