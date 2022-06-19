import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(
    path.dirname(require.main.filename || process.mainModule.filename),
    "../.env"
  ),
});

export const { PORT } = process.env;
