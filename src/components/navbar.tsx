interface NavbarProps {
	isLoggedIn: boolean;
}

export function Navbar({ isLoggedIn }: NavbarProps) {
	return (
		<nav
			style={{
				borderBottom: "1px solid #ccc",
				marginBottom: "0rem",
				padding: "1rem",
			}}
		>
			<div style={{ alignItems: "center", display: "flex", gap: "2rem" }}>
				<a href="/" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
					Game App
				</a>
				<div style={{ display: "flex", gap: "1rem", marginLeft: "auto" }}>
					<a href="/">Home</a>
					{isLoggedIn ? (
						<>
							<a href="/profile">Profile</a>
							<a href="/logout">Logout</a>
						</>
					) : (
						<a href="/login">Login</a>
					)}
				</div>
			</div>
		</nav>
	);
}
