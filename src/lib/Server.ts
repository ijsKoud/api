import { bold } from "colorette";
import express from "express";
import { Logger } from "./Logger/Logger.js";
import { LogLevel } from "./Logger/LoggerTypes.js";
import RouteLoader from "./RouteLoader.js";

export default class {
	public server = express();
	public port = Number(process.env.PORT || 3000);

	public logger = new Logger({ level: LogLevel.Debug });
	public loader = new RouteLoader(this);

	public async start() {
		const route = await this.loader.load();
		this.server.use(route);

		this.server.listen(this.port, () => this.logger.info(`[API]: Server up and running on port ${bold(this.port)}!`));
	}
}
