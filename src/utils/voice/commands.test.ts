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

test("State management", () => {
	const states: string[] = [];
	const vcManager = new VoiceCommandManager({
		onStateChange: (state) => {
			states.push(state);
		},
	});

	expect(vcManager.getState()).toBe("idle");
	expect(vcManager.isSupported()).toBe(false); // No browser SpeechRecognition in test env
});

test("Command registration and unregistration", () => {
	const vcManager = new VoiceCommandManager();

	vcManager.registerCommand({
		callback: () => {},
		hasInput: false,
		label: "Test Command",
		matches: [/^test$/i],
	});

	expect(vcManager.getCommands()).toHaveLength(1);
	expect(vcManager.getCommands()[0].label).toBe("Test Command");

	vcManager.unregisterCommand("Test Command");
	expect(vcManager.getCommands()).toHaveLength(0);
});

test("Clear all commands", () => {
	const vcManager = new VoiceCommandManager();

	vcManager.registerCommand({
		callback: () => {},
		hasInput: false,
		label: "Command 1",
		matches: [/^one$/i],
	});
	vcManager.registerCommand({
		callback: () => {},
		hasInput: false,
		label: "Command 2",
		matches: [/^two$/i],
	});

	expect(vcManager.getCommands()).toHaveLength(2);

	vcManager.clearCommands();
	expect(vcManager.getCommands()).toHaveLength(0);
});

test("onCommandMatched callback is called", () => {
	let matchedLabel = "";
	let matchedInput = "";

	const vcManager = new VoiceCommandManager({
		onCommandMatched: (cmd, input) => {
			matchedLabel = cmd.label;
			matchedInput = input ?? "";
		},
	});

	vcManager.registerCommand({
		callback: () => {},
		hasInput: true,
		label: "Search",
		matches: [/^search (.+)$/i],
	});

	vcManager.handleTranscript("search hello world");

	expect(matchedLabel).toBe("Search");
	expect(matchedInput).toBe("hello world");
});

test("onNoMatch callback is called when no command matches", () => {
	let noMatchTranscript = "";

	const vcManager = new VoiceCommandManager({
		onNoMatch: (transcript) => {
			noMatchTranscript = transcript;
		},
	});

	vcManager.registerCommand({
		callback: () => {},
		hasInput: false,
		label: "Test",
		matches: [/^test$/i],
	});

	vcManager.handleTranscript("something else");

	expect(noMatchTranscript).toBe("something else");
});

test("onTranscript callback can be set", () => {
	let receivedTranscript = "";

	new VoiceCommandManager({
		onTranscript: (transcript) => {
			receivedTranscript = transcript;
		},
	});

	// Note: onTranscript is only called during recognition, not handleTranscript
	// This test just verifies the callback can be set
	expect(receivedTranscript).toBe("");
});

test("setCallbacks updates callbacks", () => {
	let called = false;
	const vcManager = new VoiceCommandManager();

	vcManager.setCallbacks({
		onNoMatch: () => {
			called = true;
		},
	});

	vcManager.handleTranscript("unknown command");
	expect(called).toBeTrue();
});
