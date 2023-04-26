import { bold } from "colorette";
import express from "express";
import RouteLoader from "./RouteLoader.js";
import { createClient } from "redis";
import MyAnimeListCron from "./Tasks/MyAnimeList.js";
import { Logger, LogLevel } from "@snowcrystals/icicle";

export default class {
	public server = express();
	public port = Number(process.env.PORT || 3000);

	public logger = new Logger({ level: LogLevel.Debug });
	public loader = new RouteLoader(this);

	public redis = createClient({ url: process.env.DB_URL as string });

	public async start() {
		const route = await this.loader.load();
		this.server.use(route);

		this.cron();
		await this.database();
		this.server.listen(this.port, () => this.logger.info(`[API]: Server up and running on port ${bold(this.port)}!`));
	}

	private cron() {
		MyAnimeListCron(this);
	}

	private async database() {
		this.redis.on("ready", () => this.logger.info("[REDIS]: Connection established with remote database."));
		this.redis.on("error", (err) => this.logger.error("[REDIS]: ", err));

		await this.redis.connect();
	}
}
