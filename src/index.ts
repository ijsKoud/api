import "./lib/env.js";

import { join } from "node:path";
import { ApiServer } from "./lib/Server.js";
import { fileURLToPath } from "node:url";

const redisConfig = {
	username: process.env.REDIS_DATABASE_USERNAME,
	password: process.env.REDIS_DATABASE_PASSWORD,
	port: Number(process.env.REDIS_DATABASE_PORT),
	host: process.env.REDIS_DATABASE_HOST
};

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const server = new ApiServer({ highway: { routePath: join(__dirname, "routes") }, redis: redisConfig });
void server.listen(Number(process.env.PORT) || 3000);
