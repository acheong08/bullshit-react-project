import "reflect-metadata";
import { expect, test } from "bun:test";
import { DataSource } from "typeorm";
import { User } from "$entity/User";

test("Add and remove user", async () => {
	const AppDataSource = new DataSource({
		database: "/tmp/test.db",
		entities: [User],
		synchronize: true,
		type: "sqlite",
	});

	await AppDataSource.initialize();
	const user = new User();
	user.username = "testuser";
	user.passwordHash = "placeholder";
	user.email = "example@example.com";
	await user.save();
	const allUsers = await User.find();
	expect(allUsers).toHaveLength(1);
	for (const user of allUsers) {
		await user.remove();
	}
	expect(await User.find()).toHaveLength(0);
});
