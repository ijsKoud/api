import type { RouteData, RouteFn } from "../lib/types.js";

const ListenFn: RouteFn = (req, res) => {
	res.send("hello world");
};

export const route: RouteData = {
	type: "get",
	route: "/anime"
};

export default ListenFn;
