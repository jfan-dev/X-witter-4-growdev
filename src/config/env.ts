import 'dotenv/config';

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  jwtSecret: requireEnv(process.env.JWT_SECRET, "JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};