#!/usr/bin/env bun
/**
 * Generate a bcrypt password hash for the admin user
 * Usage: bun scripts/generate-admin-hash.ts <password>
 */

import { hashPassword } from "../src/utils/password";

async function main() {
	const password = process.argv[2];

	if (!password) {
		console.error("Usage: bun scripts/generate-admin-hash.ts <password>");
		console.error("");
		console.error("Example:");
		console.error("  bun scripts/generate-admin-hash.ts MySecurePassword123");
		process.exit(1);
	}

	console.log("Generating password hash...");
	const hash = await hashPassword(password);
	console.log("");
	console.log("Password hash generated successfully!");
	console.log("");
	console.log("Add this to your .env file:");
	console.log(`ADMIN_PASSWORD_HASH=${hash}`);
	console.log("");
}

await main();
