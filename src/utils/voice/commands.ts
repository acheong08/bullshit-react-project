/// <reference types="dom-speech-recognition" />

export interface Command {
	label: string;
	callback: (input: string | null) => void;
	matches: RegExp[];
	hasInput: boolean;
}

export type VoiceCommandState = "idle" | "listening" | "processing";

export interface VoiceCommandCallbacks {
	onStateChange?: (state: VoiceCommandState) => void;
	onError?: (error: string) => void;
	onTranscript?: (transcript: string) => void;
	onCommandMatched?: (command: Command, input: string | null) => void;
	onNoMatch?: (transcript: string) => void;
}

export class VoiceCommandManager {
	private availableCommands: Command[] = [];
	private recognition: SpeechRecognition | undefined;
	private state: VoiceCommandState = "idle";
	private callbacks: VoiceCommandCallbacks = {};

	constructor(callbacks?: VoiceCommandCallbacks) {
		if (callbacks) {
			this.callbacks = callbacks;
		}

		const SpeechRecognitionAPI =
			typeof window !== "undefined"
				? window.SpeechRecognition || window.webkitSpeechRecognition
				: undefined;

		this.recognition = SpeechRecognitionAPI
			? new SpeechRecognitionAPI()
			: undefined;

		if (this.recognition !== undefined) {
			this.recognition.continuous = false;
			this.recognition.lang = "en-US";
			this.recognition.interimResults = false;
			this.recognition.maxAlternatives = 1;

			this.recognition.onstart = () => {
				this.setState("listening");
			};

			this.recognition.onend = () => {
				this.setState("idle");
			};

			this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
				this.callbacks.onError?.(event.error);
				this.setState("idle");
			};

			this.recognition.onresult = (event: SpeechRecognitionEvent) => {
				this.setState("processing");
				const transcript = event.results[0][0].transcript;
				this.callbacks.onTranscript?.(transcript);
				this.handleTranscript(transcript);
			};
		}
	}

	private setState(state: VoiceCommandState) {
		this.state = state;
		this.callbacks.onStateChange?.(state);
	}

	getState(): VoiceCommandState {
		return this.state;
	}

	isSupported(): boolean {
		return this.recognition !== undefined;
	}

	setCallbacks(callbacks: VoiceCommandCallbacks) {
		this.callbacks = { ...this.callbacks, ...callbacks };
	}

	registerCommand(command: Command) {
		this.availableCommands.push(command);
	}

	unregisterCommand(label: string) {
		this.availableCommands = this.availableCommands.filter(
			(cmd) => cmd.label !== label,
		);
	}

	clearCommands() {
		this.availableCommands = [];
	}

	getCommands(): Command[] {
		return [...this.availableCommands];
	}

	handleTranscript(transcript: string) {
		let matched = false;
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
				matched = true;
				this.callbacks.onCommandMatched?.(cmd, input);
				cmd.callback(input);
			}
		}
		if (!matched) {
			this.callbacks.onNoMatch?.(transcript);
		}
	}

	startRecognition(): number {
		if (this.recognition === undefined) {
			this.callbacks.onError?.("Speech recognition not supported");
			return 1;
		}
		if (this.state !== "idle") {
			return 2;
		}
		try {
			this.recognition.start();
			return 0;
		} catch (e) {
			this.callbacks.onError?.(
				e instanceof Error ? e.message : "Failed to start recognition",
			);
			return 3;
		}
	}

	stopRecognition(): number {
		if (this.recognition === undefined) {
			return 1;
		}
		if (this.state === "idle") {
			return 2;
		}
		try {
			this.recognition.stop();
			return 0;
		} catch (e) {
			this.callbacks.onError?.(
				e instanceof Error ? e.message : "Failed to stop recognition",
			);
			return 3;
		}
	}

	abortRecognition(): number {
		if (this.recognition === undefined) {
			return 1;
		}
		if (this.state === "idle") {
			return 2;
		}
		try {
			this.recognition.abort();
			this.setState("idle");
			return 0;
		} catch (e) {
			this.callbacks.onError?.(
				e instanceof Error ? e.message : "Failed to abort recognition",
			);
			return 3;
		}
	}
}
