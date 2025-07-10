import dotenv from "dotenv";
import path from "path";

// Load `.env` from one level up (from `src/config.ts` to `../.env`)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

if (!process.env.HTTP_BACKEND && !process.env.WS_URL) {
  throw new Error("HTTP_BACKEND and WS_URL must be defined");
}

export const HTTP_BACKEND = process.env.HTTP_BACKEND;
export const WS_URL = process.env.WS_URL;
