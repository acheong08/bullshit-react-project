"use client";
import { useState } from "react";
import { registerUser } from "../action.tsx";

export function RegisterPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	// Handle registration form once it's submitted
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
		} else {
			try {
				const response = await registerUser(username, password, email);

				// Check if registration was successful, redirecting to login if yes
				if (response.success) {
					window.location.href = "/login";
				} else {
					setError(
						response.error ||
							"There has been a registration failure. Please try again.",
					);
				}
			} catch {
				setError("An error occurred while registering you.");
			}
		}

		console.log("form submitted!", { password, username });
	}

	return (
		<div id="root">
			<main className="auth-container">
				{/* Banner image */}
				<div className="auth-banner" />

				{/* User credentials form*/}
				<form onSubmit={handleSubmit} className="auth-form">
					<h1 className="form-header">Register</h1>
					{error && <div className="error-banner">{error}</div>}
					<div className="input-container">
						<label htmlFor="email">Email Address</label>
						<input
							type="email"
							className="form-input"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
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
					<div className="input-container">
						<label htmlFor="password-confirm">Confirm Password</label>
						<input
							type="password"
							className="form-input"
							id="confirm-password"
							name="confirm-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="primary-btn">
						Register Account
					</button>
				</form>
			</main>
		</div>
	);
}
