import dotenv from "dotenv";
import path from "path";

// Load `.env` from one level up (from `src/config.ts` to `../.env`)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

if (!process.env.JWT_SECRET && !process.env.PORT) {
  throw new Error("JWT_SECRET and PORT must be defined");
}

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const PORT = process.env.PORT
