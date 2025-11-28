"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	type Command,
	VoiceCommandManager,
	type VoiceCommandState,
} from "$utils/voice/commands";

interface VoiceCommandContextValue {
	state: VoiceCommandState;
	isSupported: boolean;
	startListening: () => void;
	stopListening: () => void;
	registerCommand: (command: Command) => void;
	unregisterCommand: (label: string) => void;
	getCommands: () => Command[];
	lastTranscript: string | null;
	lastError: string | null;
}

const VoiceCommandContext = createContext<VoiceCommandContextValue | null>(
	null,
);

interface VoiceCommandProviderProps {
	children: ReactNode;
}

export function VoiceCommandProvider({ children }: VoiceCommandProviderProps) {
	const [state, setState] = useState<VoiceCommandState>("idle");
	const [isSupported, setIsSupported] = useState(false);
	const [lastTranscript, setLastTranscript] = useState<string | null>(null);
	const [lastError, setLastError] = useState<string | null>(null);
	const managerRef = useRef<VoiceCommandManager | null>(null);

	// Lazy initialization - runs synchronously on first access (client-side only)
	if (managerRef.current === null && typeof window !== "undefined") {
		managerRef.current = new VoiceCommandManager({
			onError: (error) => {
				setLastError(error);
			},
			onNoMatch: (transcript) => {
				alert(`No command matched for: "${transcript}"`);
			},
			onStateChange: (newState) => {
				setState(newState);
			},
			onTranscript: (transcript) => {
				setLastTranscript(transcript);
			},
		});
	}

	// Set isSupported after mount and handle cleanup
	useEffect(() => {
		if (managerRef.current) {
			setIsSupported(managerRef.current.isSupported());
		}

		return () => {
			managerRef.current?.abortRecognition();
		};
	}, []);

	const startListening = useCallback(() => {
		setLastError(null);
		managerRef.current?.startRecognition();
	}, []);

	const stopListening = useCallback(() => {
		managerRef.current?.stopRecognition();
	}, []);

	const registerCommand = useCallback((command: Command) => {
		managerRef.current?.registerCommand(command);
	}, []);

	const unregisterCommand = useCallback((label: string) => {
		managerRef.current?.unregisterCommand(label);
	}, []);

	const getCommands = useCallback(() => {
		return managerRef.current?.getCommands() ?? [];
	}, []);

	const value = useMemo(
		() => ({
			getCommands,
			isSupported,
			lastError,
			lastTranscript,
			registerCommand,
			startListening,
			state,
			stopListening,
			unregisterCommand,
		}),
		[
			state,
			isSupported,
			startListening,
			stopListening,
			registerCommand,
			unregisterCommand,
			getCommands,
			lastTranscript,
			lastError,
		],
	);

	return (
		<VoiceCommandContext.Provider value={value}>
			{children}
		</VoiceCommandContext.Provider>
	);
}

export function useVoiceCommands(): VoiceCommandContextValue {
	const context = useContext(VoiceCommandContext);
	if (!context) {
		throw new Error(
			"useVoiceCommands must be used within a VoiceCommandProvider",
		);
	}
	return context;
}
