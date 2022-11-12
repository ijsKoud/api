import { config } from "dotenv";
config();

import Server from "./lib/Server.js";

const server = new Server();
void server.start();
