"use client";

import { useEffect } from "react";
import { useVoiceCommands } from "./voice-command-provider";

/**
 * This component registers global navigation voice commands.
 * It should be rendered once at the app root level.
 */
export function VoiceNavigationCommands() {
	const { registerCommand, unregisterCommand } = useVoiceCommands();

	useEffect(() => {
		// Navigate to home
		registerCommand({
			callback: () => {
				window.location.href = "/";
			},
			hasInput: false,
			label: "Go Home",
			matches: [/^go (?:to )?home$/i, /^home page$/i, /^take me home$/i],
		});

		// Navigate to login
		registerCommand({
			callback: () => {
				window.location.href = "/login";
			},
			hasInput: false,
			label: "Go to Login",
			matches: [
				/^go (?:to )?login$/i,
				/^login page$/i,
				/^log in$/i,
				/^sign in$/i,
			],
		});

		// Navigate to profile
		registerCommand({
			callback: () => {
				window.location.href = "/profile";
			},
			hasInput: false,
			label: "Go to Profile",
			matches: [
				/^go (?:to )?(?:my )?profile$/i,
				/^profile page$/i,
				/^my profile$/i,
				/^show (?:my )?profile$/i,
			],
		});

		// Search for games
		registerCommand({
			callback: (input) => {
				if (input) {
					const searchParams = new URLSearchParams({ query: input });
					window.location.href = `/search?${searchParams.toString()}`;
				}
			},
			hasInput: true,
			label: "Search",
			matches: [
				/^search (?:for )?(.+)$/i,
				/^find (?:game )?(.+)$/i,
				/^look for (.+)$/i,
			],
		});

		// Go back
		registerCommand({
			callback: () => {
				window.history.back();
			},
			hasInput: false,
			label: "Go Back",
			matches: [/^go back$/i, /^back$/i, /^previous page$/i],
		});

		// Cleanup on unmount
		return () => {
			unregisterCommand("Go Home");
			unregisterCommand("Go to Login");
			unregisterCommand("Go to Profile");
			unregisterCommand("Search");
			unregisterCommand("Go Back");
		};
	}, [registerCommand, unregisterCommand]);

	// This component doesn't render anything
	return null;
}
