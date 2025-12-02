"use client";

import { useEffect, useState } from "react";
import type { User } from "$entity/User.ts";
import { setCookie } from "$utils/cookies";
import { getTheme } from "$utils/theme";
import { useVoiceCommands } from "./voice-command-provider";

interface NavbarProps {
	user: User | null;
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
				<img className="moon-icon" src="/images/moon.png" alt="Moon Icon" />
			</div>
		</button>
	);
}
interface VoiceCommandButtonProps {
	isDark: boolean;
}
function VoiceCommandButton({ isDark }: VoiceCommandButtonProps) {
	const { state, isSupported, startListening, stopListening } =
		useVoiceCommands();

	if (!isSupported) {
		return null;
	}

	const handleClick = () => {
		if (state === "idle") {
			startListening();
		} else {
			stopListening();
		}
	};

	const getStatusText = () => {
		switch (state) {
			case "listening":
				return "Listening...";
			case "processing":
				return "Processing...";
			default:
				return null;
		}
	};

	const statusText = getStatusText();

	return (
		<button
			className="clear-button-stylings voice-button"
			onClick={handleClick}
			data-state={state}
			type="button"
			aria-label={
				state === "idle" ? "Start voice command" : "Stop voice command"
			}
		>
			<img
				className="voice-button-icon"
				src={
					isDark
						? "/images/darkmode-microphone.png"
						: "/images/lightmode-microphone.png"
				}
				alt="Microphone"
			/>
			{statusText && (
				<span className="voice-status-indicator">{statusText}</span>
			)}
		</button>
	);
}

export function Navbar({ user }: NavbarProps) {
	const [isDark, setDark] = useState<"dark" | "light">("dark");

	// Load theme
	useEffect(() => {
		const initialTheme = getTheme();
		document.documentElement.setAttribute("data-theme", initialTheme);
	}, []);

	return (
		<nav className="navbar">
			<div className="navbar-section flex">
				<a href="/" aria-label="TO home page, logo">
					<img
						className="navbar-logo"
						src="/images/logo.png"
						alt="Company Logo"
					/>
				</a>

				{user ? (
					<>
						{/* Profile picture */}
						<a href={"/profile"}>
							<img
								className="navbar-profile-pic"
								src={
									user.profileImage ||
									"/images/example-images/example-profile-icon.png"
								}
								alt="Profile Icon links to home page"
							/>
						</a>

						{/* Username */}
						<a
							href={"/profile"}
							className="navbar-username"
							aria-label={`Your Username: ${user.username}`}
						>
							{user.username}
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
				<VoiceCommandButton isDark={isDark === "dark"} />

				<DarkLightToggle
					isDark={isDark === "dark"}
					onToggle={async () => {
						setDark(isDark === "dark" ? "light" : "dark");
						await setCookie("theme", isDark);
						document.documentElement.setAttribute("data-theme", isDark);
					}}
				/>

				<a href="/wishlist" aria-label={"to your wishlist"}>
					<img
						className="navbar-image"
						src="/images/wishlist-icon.png"
						alt="Wishlist Icon"
					/>
				</a>
			</div>
		</nav>
	);
}
