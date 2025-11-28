"use client";
import { useState } from "react";
import { setCookie } from "$utils/cookies";
import { loginUser } from "../action";

export function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Handle login form once it's submitted
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await loginUser(username, password);

			if (result.success && result.token) {
				// Set the auth token in a cookie using Cookie Store API
				await setCookie("authToken", result.token, {
					maxAge: 60 * 60 * 24 * 7, // 7 days
					sameSite: "strict",
				});

				// Redirect to home page or refresh
				window.location.href = "/";
			} else {
				setError(result.error || "Login failed");
			}
		} catch (_err) {
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	//TODO: no alt tagged image for banner
	return (
		<div id="root">
			<main className="auth-container">
				{/* Banner image */}
				<div className="auth-banner" />

				{/* User credentails form*/}
				<form onSubmit={handleSubmit} className="auth-form">
					<h1 className="form-header">Login</h1>

					{error && (
						<div className="error-banner" role="alert" aria-live="assertive">
							<span className="sr-only">Error: </span>
							{error}
						</div>
					)}

					<div className="input-container">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							className="form-input"
							id="username"
							name="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={isLoading}
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
							disabled={isLoading}
							required
						/>
					</div>
					<button type="submit" className="primary-btn" disabled={isLoading}>
						{isLoading ? "Logging in..." : "Login"}
					</button>
					<a href="/register" className="register-link">
						Don't have an account with us? Register now!
					</a>
				</form>
			</main>
		</div>
	);
}
