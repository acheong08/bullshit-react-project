"use client";

import { useState } from "react";
import { setCookie } from "../utils/cookies";

interface NavbarProps {
	isLoggedIn: boolean;
	initialDark: boolean;
}

interface DarkLightToggleProps {
	isDark: boolean;
	onToggle: () => void;
}

function DarkLightToggle({ isDark, onToggle }: DarkLightToggleProps) {
	return (
		<button
			className="clear-button-stylings dark-light-button"
			onClick={onToggle}
			role="switch"
			aria-checked={isDark}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			type="button"
		>
			<div className="dark-light-toggle">
				<div className="toggle-thumb" />
				<span className="sun-icon">✶</span>
				<img
					className="moon-icon"
					src="/public/images/moon.png"
					alt="Moon Icon"
				/>
			</div>
		</button>
	);
}

export function Navbar({ isLoggedIn, initialDark }: NavbarProps) {
	const [isDark, setDark] = useState(initialDark);

	return (
		<nav className="navbar">
			<div className="navbar-section flex">
				<a href="/">
					<img
						className="navbar-logo"
						src="/public/images/logo.png"
						alt="Company Logo"
					/>
				</a>
				{isLoggedIn ? (
					<>
						<a href="/user/ExampleUsername123">
							<img
								className="navbar-profile-pic"
								src="/public/images/example-images/example-profile-icon.png"
								alt="Profile Icon"
							/>
						</a>
						<a href="/user/ExampleUsername123" className="navbar-username">
							ExampleUsername123
						</a>
					</>
				) : (
					<button className="navbar-button" type="button">
						<a href="/login" className="clear-a-stylings">
							Login
						</a>
					</button>
				)}
			</div>

			<div className="navbar-section flex">
				<DarkLightToggle
					isDark={isDark}
					onToggle={async () => {
						setDark(!isDark);
						await setCookie("theme", isDark ? "light" : "dark");
						document.documentElement.setAttribute(
							"data-theme",
							isDark ? "light" : "dark",
						);
					}}
				/>
				<a href="/user/username/wishlist">
					<img
						className="navbar-image"
						src="/public/images/wishlist-icon.png"
						alt="Company Logo"
					/>
				</a>
			</div>
		</nav>
	);
}
