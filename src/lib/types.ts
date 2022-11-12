import type { NextFunction, Request, Response } from "express";

export interface RouteObject {
	default: RouteFn;
	route: RouteData;
}

export interface RouteData {
	type: "get" | "post" | "put" | "delete" | "patch";
	route: string;
}

export type RouteFn = (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>;
