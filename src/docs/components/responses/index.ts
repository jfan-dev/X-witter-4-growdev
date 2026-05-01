import { authResponses } from "./auth.responses.js";
import { commonResponses } from "./common.responses.js";

export const responses = {
  ...commonResponses,
  ...authResponses,
};