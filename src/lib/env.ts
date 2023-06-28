import { config } from "dotenv";
import { join } from "node:path";

const envDirectory = join(process.cwd(), ".env");
config({ path: envDirectory, debug: true });

import { ZodError, z } from "zod";
import { Logger } from "@snowcrystals/icicle";
import { bold } from "colorette";

const logger = new Logger({ parser: { color: true }, name: "Env Parser" });
const envSchema = z.object({
	REDIS_DATABASE_USERNAME: z.string(),
	REDIS_DATABASE_PASSWORD: z.string(),
	REDIS_DATABASE_PORT: z.string(),
	REDIS_DATABASE_HOST: z.string()
});

try {
	logger.info(`Loaded .env from ${bold(envDirectory)}`);
	envSchema.parse(process.env);
} catch (err) {
	if (!(err instanceof ZodError)) {
		console.error(err);
		process.exit(1);
	}

	// Filter out missing ones
	const missing = err.issues.filter((issue) => issue.message === "Required").map((issue) => bold(issue.path[0]));
	logger.fatal(`The following environment variables are missing: ${missing}`);

	const failedTest = err.issues.filter((issue) => issue.message !== "Required");
	for (const failedItem of failedTest) {
		// Environment variable
		const path = failedItem.path[0];
		logger.fatal(`[${path}]: Failed the test with reason: ${failedItem.message}`);
	}

	process.exit(1);
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}
