/// <reference types="dom-speech-recognition" />

interface Command {
	label: string;
	callback: (input: string | null) => void;
	matches: RegExp[];
	hasInput: boolean;
}

export class VoiceCommandManager {
	private availableCommands: Command[] = [];
	private recognition: SpeechRecognition | undefined;

	constructor() {
		this.recognition =
			typeof window !== "undefined" &&
			typeof window.SpeechRecognition !== "undefined"
				? new SpeechRecognition()
				: undefined;
		if (this.recognition !== undefined) {
			this.recognition.continuous = false;
			this.recognition.lang = "en-US";
			this.recognition.interimResults = false;
			this.recognition.maxAlternatives = 1;
		}
	}

	registerCommand(command: Command) {
		this.availableCommands.push(command);
	}

	handleTranscript(transcript: string) {
		for (const cmd of this.availableCommands) {
			for (const match of cmd.matches) {
				if (!match.test(transcript)) {
					continue;
				}
				let input: string | null = null;
				if (cmd.hasInput) {
					const rMatches = match.exec(transcript);
					if (rMatches === null) {
						throw Error("Command with input should never match and fail");
					}
					input = rMatches[1];
				}
				cmd.callback(input);
			}
		}
	}

	startRecognition() {
		if (this.recognition === undefined) {
			return 1;
		}
		this.recognition.start();
		this.recognition.onresult = (event: SpeechRecognitionEvent) => {
			const trans = event.results[0][0].transcript;
			this.handleTranscript(trans);
		};
		return 0;
	}
}
