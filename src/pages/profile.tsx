"use client";

import { useEffect, useState } from "react";
import { Dropdown } from "$components/forms/dropdown.tsx";
import { Toggle } from "$components/forms/toggle.tsx";
import { getCookie, setCookie } from "$utils/cookies.ts";
import {
	getUserData,
	updateAccessibilitySettings,
	updateProfileImage,
	updateUser,
} from "../action.tsx";

interface Settings {
	captions: boolean;
	captionStyle: string;
	audioDescriptions: boolean;
	soundFeedback: boolean;

	voiceControls: boolean;
	keyboardNavigation: boolean;
	buttonSize: string;
	gestureSensitivity: string;
	scrollSpeed: string;
}

export function ProfilePage() {
	// State variables
	const [settings, setSettings] = useState<Settings>({
		audioDescriptions: false,
		buttonSize: "Medium",
		captionStyle: "High Contrast",
		captions: false,
		gestureSensitivity: "Medium",
		keyboardNavigation: false,
		scrollSpeed: "Medium",
		soundFeedback: false,
		voiceControls: false,
	});
	const [newUsername, setNewUsername] = useState("");
	const [oldUsername, setOldUsername] = useState("");
	const [profileImage, setProfileImage] = useState<string>("");
	const [newImageFile, setNewImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");

	// Load the user information
	async function loadUser() {
		// Fetch token
		const token = await getCookie("authToken");
		if (!token) {
			return;
		}

		// Load user data from token, setting necessary variables
		const userData = await getUserData(token);
		if (userData.success) {
			setOldUsername(userData.username);
			if (userData.profileImage) {
				setProfileImage(userData.profileImage);
			}
			if (userData.accessibilitySettings) {
				setSettings(userData.accessibilitySettings);
			}
		}
	}

	useEffect(() => {
		loadUser().catch((error) => console.error(error));
	});

	// Handles updating and saving personal settings
	const handleToggle = (settingName: keyof Settings) => {
		setSettings((prev) => ({
			...prev,
			[settingName]: !prev[settingName],
		}));
	};

	// Opens the profile update modals
	function openModal(modal: string) {
		const element = document.querySelector<HTMLElement>(`#${modal}`);
		if (element) {
			element.classList.add("active");
		}
	}

	// Closes the profile update modals
	function closeModal(modal: string) {
		const element = document.querySelector<HTMLElement>(`#${modal}`);
		if (element) {
			element.classList.add("active");
		}

		// Reset image preview when closing
		if (modal === "imageModal") {
			setImagePreview("");
			setNewImageFile(null);
		}
	}

	// Handles username updating logic
	async function updateUsername() {
		const token = await getCookie("authToken");

		if (!token) {
			console.error("No auth token found.");
			return;
		}

		const result = await updateUser(token, newUsername);

		// Set new cookie w/ new info
		if (result.success && result.token) {
			await setCookie("authToken", result.token, {
				maxAge: 60 * 60 * 24 * 7, // 7 days
				sameSite: "strict",
			});
			window.location.reload();
		} else {
			console.error(result.error);
		}
	}

	// Handles image file selection
	function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			alert("Please select an image file");
			return;
		}

		// Validate file size (5MB) (variable)
		if (file.size > 5 * 1024 * 1024) {
			alert("Image size must be less than 5MB");
			return;
		}

		setNewImageFile(file);

		// Create preview on form
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	}

	// Handles image upload
	async function updateImage() {
		// Handle empty image submission
		if (!newImageFile) {
			console.error("No image file selected.");
			return;
		}

		// Fetch token
		const token = await getCookie("authToken");
		if (!token) {
			console.error("No auth token found.");
			return;
		}

		// Convert file to base64 data URL
		const reader = new FileReader();
		reader.onloadend = async () => {
			const dataUrl = reader.result as string;

			const result = await updateProfileImage(token, dataUrl);

			if (result.success) {
				setProfileImage(dataUrl);
				window.location.reload();
			} else {
				console.error(result.error);
				alert(result.error || "Failed to update profile image");
			}
		};
		reader.readAsDataURL(newImageFile);
	}

	// Save accessibility settings
	async function saveAccessibilitySettings() {
		const token = await getCookie("authToken");
		if (!token) {
			console.error("No auth token");
			return;
		}

		const result = await updateAccessibilitySettings(token, settings);

		if (!result.success) {
			alert(result.error || "Failed to save settings");
			return;
		}

		alert("Settings saved!");
	}

	// Log the user out
	async function handleLogout() {
		await cookieStore.delete("authToken");
		window.location.href = "/login";
	}

	return (
		<div id="root">
			<main>
				{/* Header */}
				<section className="profile-ctrl">
					<a className="home-link" href="/">
						<img
							src="/images/icons/back-button.png"
							alt="Back button icon"
							className="back-button"
						/>
						<p className="home-link-txt">Back to home page</p>
					</a>
					<button className="logout-btn" type="button" onClick={handleLogout}>
						Logout
					</button>
				</section>

				{/* Profile */}
				<section className="profile-details">
					<div className="profile-image-edit">
						<img
							src={profileImage}
							alt="Profile icon"
							className="profile-image"
						/>
						<button
							className="profile-edit"
							type="button"
							onClick={() => openModal("imageModal")}
						>
							<img
								src="/public/images/icons/edit-button.png"
								alt="Edit icon"
								className="edit-icon"
							/>
						</button>
					</div>
					<div className="profile-info">
						<h1 className="page-title">
							{oldUsername}
							<button
								className="profile-edit"
								type="button"
								onClick={() => openModal("usernameModal")}
							>
								<img
									src="/public/images/icons/edit-button.png"
									alt="Edit icon"
									className="edit-icon"
								/>
							</button>
						</h1>
						<h2 className="profile-detail">Profile created DATE</h2>
					</div>
				</section>

				{/* Tags */}
				<section className="profile-tags">
					<h2 className="page-subheader">Profile Tags</h2>
					<div className="tag-gallery">
						<div className="tag-card">
							<p>Blindness</p>
						</div>
						<button className="secondary-btn" type="button">
							<img
								src="/public/images/icons/add-button.png"
								alt="Plus icon"
								className="add"
							/>
							<p>Add new tag</p>
						</button>
					</div>
				</section>

				{/* Accessibility Options */}
				<section className="profile-options">
					<h2 className="page-subheader">Accessibility Options</h2>

					{/* Audio and captions section*/}
					<div className="option">
						<h3 className="subsection-header">Audio & Captions</h3>
						<div className="option-list">
							<Toggle
								label="Captions"
								isChecked={settings.captions}
								onChange={() => handleToggle("captions")}
								id="captions"
							/>

							<Dropdown
								label="Caption Style"
								options={[
									"High Contrast",
									"Dark Mode",
									"Light Mode",
									"Default",
								]}
								value={settings.captionStyle}
								onChange={(value) =>
									setSettings((prev) => ({ ...prev, captionStyle: value }))
								}
								id="caption-style"
							/>

							<Toggle
								label="Audio Descriptions"
								isChecked={settings.audioDescriptions}
								onChange={() => handleToggle("audioDescriptions")}
								id="audio-descriptions"
							/>

							<Toggle
								label="Sound Feedback"
								isChecked={settings.soundFeedback}
								onChange={() => handleToggle("soundFeedback")}
								id="sound-feedback"
							/>
						</div>
					</div>

					{/* Interaction and input section*/}
					<div className="option">
						<h3 className="subsection-header">Interaction & Inputs</h3>
						<div className="option-list">
							<Toggle
								label="Voice Controls"
								isChecked={settings.voiceControls}
								onChange={() => handleToggle("voiceControls")}
								id="voice-controls"
							/>

							<Toggle
								label="Keyboard Navigation"
								isChecked={settings.keyboardNavigation}
								onChange={() => handleToggle("keyboardNavigation")}
								id="keyboard-navigation"
							/>

							<Dropdown
								label="Button Size"
								options={["Small", "Medium", "Large"]}
								value={settings.buttonSize}
								onChange={(value) =>
									setSettings((prev) => ({ ...prev, buttonSize: value }))
								}
								id="button-size"
							/>

							<Dropdown
								label="Gesture Sensitivity"
								options={["Low", "Medium", "High"]}
								value={settings.gestureSensitivity}
								onChange={(value) =>
									setSettings((prev) => ({
										...prev,
										gestureSensitivity: value,
									}))
								}
								id="gesture-sensitivity"
							/>

							<Dropdown
								label="Auto-Scroll Speed"
								options={["Slow", "Medium", "Fast"]}
								value={settings.scrollSpeed}
								onChange={(value) =>
									setSettings((prev) => ({ ...prev, scrollSpeed: value }))
								}
								id="scroll-speed"
							/>
						</div>
					</div>
					<button
						className="primary-btn"
						type="button"
						onClick={saveAccessibilitySettings}
					>
						Save Changes
					</button>
				</section>

				{/* Update username modal */}
				<section className="modal-wrap" id="usernameModal">
					<div className="update-form">
						<button
							className="close-btn"
							onClick={() => closeModal("usernameModal")}
							type="button"
						>
							X
						</button>
						<div className="input-container">
							<label htmlFor="username">Updated username:</label>
							<input
								type="text"
								name="username"
								id="username"
								className="form-input"
								placeholder={oldUsername}
								onChange={(e) => {
									setNewUsername(e.target.value);
								}}
							/>
							<button
								className="primary-btn"
								type="button"
								onClick={updateUsername}
							>
								Update
							</button>
						</div>
					</div>
				</section>

				{/* Update image modal */}
				<section className="modal-wrap" id="imageModal">
					<div className="update-form">
						<button
							className="close-btn"
							onClick={() => closeModal("imageModal")}
							type="button"
						>
							X
						</button>
						<div className="input-container">
							<label htmlFor="profile">Updated image:</label>
							<input
								type="file"
								name="profile"
								id="profile"
								className="form-input"
								accept="image/*"
								onChange={handleImageSelect}
							/>
							{imagePreview && (
								<div style={{ marginTop: "10px" }}>
									<img
										src={imagePreview}
										alt="Preview"
										style={{
											borderRadius: "8px",
											maxHeight: "200px",
											maxWidth: "200px",
										}}
									/>
								</div>
							)}
							<button
								className="primary-btn"
								type="button"
								onClick={updateImage}
								disabled={!newImageFile}
							>
								Update
							</button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
