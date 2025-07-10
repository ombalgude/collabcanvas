// import dotenv from "dotenv";

// // Load from the ROOT env file (go up 3 levels to reach root)
// dotenv.config({ path: "../.env" });


// if (!process.env.JWT_SECRET) {
//   throw new Error("JWT_SECRET must be defined");
// }

// export const JWT_SECRET = process.env.JWT_SECRET!;



////////////

import dotenv from "dotenv";
import path from "path";

// Load `.env` from one level up (from `src/config.ts` to `../.env`)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}

export const JWT_SECRET = process.env.JWT_SECRET!;
