import { config } from "dotenv";
import { join } from "node:path";

config({ path: join(process.cwd(), "data", ".env") });

import Server from "./lib/Server.js";

const server = new Server();
void server.start();
