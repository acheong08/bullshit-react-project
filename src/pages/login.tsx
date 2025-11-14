"use client";
import { useState } from "react";

export function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	// Handle login form once it's submitted
	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// TODO: Replace with actual login logic
		console.log("form submitted!", { password, username });
	}

	return (
		<div id="root">
			<main className="login-container">
				{/* Banner image */}
				<div className="login-banner" />

				{/* User credentails form*/}
				<form onSubmit={handleSubmit} className="auth-form">
					<h1 className="form-header">Login</h1>
					<div className="input-container">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							className="form-input"
							id="username"
							name="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="input-container">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							className="form-input"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="primary-btn">
						Login
					</button>
				</form>
			</main>
		</div>
	);
}
