import { expect, test } from "bun:test";
import { VoiceCommandManager } from "./commands";

test("Transcript regex and extraction", () => {
	const vcManager = new VoiceCommandManager();
	let loggedIn = false;
	vcManager.registerCommand({
		callback: (input: string | null) => {
			expect(input).toBeNull();
			loggedIn = true;
		},
		hasInput: false,
		label: "Log in",
		matches: [/^Log in/i],
	});
	vcManager.registerCommand({
		callback: (_: string | null) => {
			expect(false).toBeTrue();
		},
		hasInput: false,
		label: "Log out",
		matches: [/^Log out/i],
	});
	vcManager.handleTranscript("log in");
	expect(loggedIn).toBeTrue();
});

test("Transcript input extraction", () => {
	const vcManager = new VoiceCommandManager();
	let searched = false;
	vcManager.registerCommand({
		callback: (input: string | null) => {
			expect(input).toBe("JavaScript sucks");
			searched = true;
		},
		hasInput: true,
		label: "Search",
		matches: [/Search for (.*)/i],
	});
	vcManager.handleTranscript("Search for JavaScript sucks");
	expect(searched).toBeTrue();
});
