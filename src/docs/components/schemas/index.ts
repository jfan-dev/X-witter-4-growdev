import { authSchemas } from "./auth.schemas.js";
import { commonSchemas } from "./common.schemas.js";
import { feedSchemas } from "./feed.schemas.js";
import { healthSchemas } from "./health.schemas.js";
import { usersSchemas } from "./users.schemas.js";
import { xweetsSchemas } from "./xweets.schemas.js";

export const schemas = {
  ...commonSchemas,
  ...authSchemas,
  ...usersSchemas,
  ...xweetsSchemas,
  ...feedSchemas,
  ...healthSchemas,
};