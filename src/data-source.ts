import { DataSource } from "typeorm";
import { Game, GameMedia, Label } from "$entity/Games";
import { Report } from "$entity/Report";
import { Review } from "$entity/Review";
import { User } from "$entity/User";

export const AppDataSource = new DataSource({
	database: process.env.POSTGRES_DB || "test",
	entities: [User, Game, GameMedia, Label, Report, Review],
	host: process.env.POSTGRES_HOST || "postgres",
	logging: process.env.POSTGRES_LOGGING === "true" || false,
	migrations: [],
	password: process.env.POSTGRES_PASSWORD || "test",
	port: Number.parseInt(process.env.POSTGRES_PORT || "5432", 10),
	subscribers: [],
	synchronize: process.env.POSTGRES_SYNCHRONIZE === "true" || true,
	type: "postgres",
	username: process.env.POSTGRES_USER || "test",
});
