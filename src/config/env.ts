import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as JwtExpiresIn;

export const env = {
  jwtSecret: requireEnv(process.env.JWT_SECRET, "JWT_SECRET"),
  jwtExpiresIn,
};