import { Route, methods } from "@snowcrystals/highway";
import type { ApiServer } from "../../lib/Server.js";
import type { Request, Response } from "express";

export default class extends Route<ApiServer> {
	public async [methods.GET](req: Request, res: Response) {
		const data = await this.server.redis.get("anime");
		if (!data) {
			res.send([]);
			return;
		}

		const parsedData = JSON.parse(data);
		res.json({ list: parsedData, username: "ijsKoud" });
	}
}
