"use client";
import * as cookie from "cookie";

export function getTheme() {
	const storedDark = cookie.parse(document.cookie).theme;
	if (storedDark !== undefined) {
		return storedDark;
	}
	if (typeof window !== "undefined" && window.matchMedia) {
		const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		return isDark ? "dark" : "light";
	}
	return "dark";
}
