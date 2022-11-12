import { Router } from "express";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type Server from "./Server.js";
import type { RouteObject } from "./types.js";

export default class {
	public directory = join(fileURLToPath(import.meta.url), "../../routes");

	public constructor(public server: Server) {}

	public async load() {
		const router = Router();

		const data = await readdir(this.directory);
		const categories = data.filter((str) => !/\.[0-9a-z]+$/i.test(str));
		categories.push("");

		for (const category of categories) {
			const files = await readdir(join(this.directory, category));
			const validFiles = files.filter((str) => str.endsWith(".js"));
			for (const file of validFiles) {
				const { default: fn, route } = (await import(join(this.directory, category, file))) as RouteObject;
				if (typeof fn !== "function" || !route || typeof route.route !== "string" || typeof route.type !== "string") {
					this.server.logger.fatal(`[LOADER]: Route with path "${join(category, file)}" has an incorrect configuration!`);
					continue;
				}

				router[route.type](route.route, (req, res, next) => fn(this.server, req, res, next));
				this.server.logger.info(`[LOADER]: ${join(category, file)} loaded.`);
			}
		}

		return router;
	}
}
