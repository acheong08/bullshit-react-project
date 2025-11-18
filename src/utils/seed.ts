import { User } from "$entity/User";

/**
 * Seeds the database with an admin user if ADMIN_USERNAME and ADMIN_PASSWORD_HASH are set
 * This function is idempotent - safe to run multiple times
 */
export async function seedAdminUser(): Promise<void> {
	const adminUsername = process.env.ADMIN_USERNAME;
	const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

	// Skip if admin credentials not configured
	if (!adminUsername || !adminPasswordHash) {
		console.log(
			"[Seed] Skipping admin user creation - ADMIN_USERNAME or ADMIN_PASSWORD_HASH not set",
		);
		return;
	}

	try {
		// Check if admin user already exists
		const existingAdmin = await User.findOne({
			where: { username: adminUsername },
		});

		if (existingAdmin) {
			console.log(`[Seed] Admin user '${adminUsername}' already exists`);
			return;
		}

		// Create admin user
		const admin = new User();
		admin.username = adminUsername;
		admin.passwordHash = adminPasswordHash;
		admin.email = process.env.ADMIN_EMAIL || `${adminUsername}@example.com`;

		await admin.save();

		console.log(`[Seed] ✓ Admin user '${adminUsername}' created successfully`);
	} catch (error) {
		console.error("[Seed] Failed to create admin user:", error);
		// Don't throw - we don't want to crash the server if seeding fails
	}
}
