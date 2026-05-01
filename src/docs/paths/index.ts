import { authPaths } from "./auth.paths.js";
import { feedPaths } from "./feed.paths.js";
import { healthPaths } from "./health.paths.js";
import { usersPaths } from "./users.paths.js";
import { xweetsPaths } from "./xweets.paths.js";

export const paths = {
  ...authPaths,
  ...xweetsPaths,
  ...usersPaths,
  ...feedPaths,
  ...healthPaths,
};