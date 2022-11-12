import type { Anime, AnimeApiResponse, RouteData, RouteFn } from "../lib/types.js";

type DatabaseResults = { data: Anime[] } | null;

const ListenFn: RouteFn = async (server, req, res) => {
	const data = (await server.redis.json.get("anime")) as DatabaseResults;
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
