import { Server, type ServerOptions } from "@snowcrystals/highway";
import { Logger } from "@snowcrystals/icicle";
import { Redis as RedisClient } from "ioredis";
import MyAnimeListTask from "../tasks/MyAnimeList.js";

export class ApiServer extends Server {
	/** The redis database client */
	public readonly redis: RedisClient;

	/** The logger instance */
	public readonly logger = new Logger({ name: "ApiServer" });

	public constructor(options: ApiServerOptions) {
		super(options.highway);
		this.redis = new RedisClient({ lazyConnect: true, ...options.redis });
	}

	public override async listen(port: number) {
		const serverCb = () => this.logger.info(`Server is listening to port ${port}.`);
		const redisCb = (err?: Error | null) =>
			err ? this.logger.error("Unable to connect to redis database - ", err) : this.logger.info("Connected to redis database.");

		await this.redis.connect(redisCb);
		MyAnimeListTask(this);
		return super.listen(port, serverCb);
	}
}

export interface ApiServerOptions {
	/** The options for the @snowcrystals/highway server */
	highway: ServerOptions;

	/** The redis database URL */
	redis: {
		username: string;
		password: string;
		host: string;
		port: number;
	};
}
