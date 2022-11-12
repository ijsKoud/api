import type { AnimeApiResponse, AnimeDatabaseResults, RouteData, RouteFn } from "../lib/types.js";

const ListenFn: RouteFn = async (server, req, res) => {
	const data = (await server.redis.json.get("anime")) as AnimeDatabaseResults;
	const response: AnimeApiResponse = {
		list: data?.data ?? [],
		username: "ijsKoud"
	};

	res.send(response);
};

export const route: RouteData = {
	type: "get",
	route: "/anime"
};

export default ListenFn;
