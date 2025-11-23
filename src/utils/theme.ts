"use client";

export function getTheme() {
	if (typeof window !== "undefined" && window.matchMedia) {
		const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		return isDark ? "dark" : "light";
	}
	return "dark";
}
