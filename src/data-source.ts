import { DataSource } from "typeorm";
import { Game, GameMedia, Label } from "./entity/Games";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
	database: "test",
	entities: [User, Game, GameMedia, Label],
	host: "postgres",
	logging: false,
	migrations: [],
	password: "test",
	port: 5432,
	subscribers: [],
	synchronize: true,
	type: "postgres",
	username: "test",
});
