# Contributing

This is a Vite + React Server Components project following the usual standards. See [Tech Stack](TechStack.md)

```
root@localhost> tree src
src
├── action.tsx // Server actions
├── assets
│   ├── games.jsonl //Game data
│   └── react.svg
├── client.tsx // Client-side entry
├── components // Reusable components
│   ├── bookmark-button.tsx
│   ├── forms
│   │   ├── dropdown.tsx
│   │   └── toggle.tsx
│   ├── gameCards // Game card variants
│   │   ├── category-card.tsx
│   │   ├── game-card.tsx
│   │   ├── popular-game-card.tsx
│   │   ├── spotlight-game-card.tsx
│   │   ├── top-charts-game-card.tsx
│   │   └── wish-list-game-card.tsx
│   ├── media-carousel.tsx
│   ├── navbar.tsx
│   ├── pagination.tsx
│   ├── report-button.tsx
│   ├── report-modal.tsx
│   ├── reviews-section.tsx
│   ├── searchbar.tsx
│   ├── voice-command-provider.tsx
│   ├── voice-navigation-commands.tsx
│   └── wishlist-page-client.tsx
├── data-source.ts // TypeORM data source configuration
├── entity // Database entities
│   ├── Games.ts
│   ├── Report.ts
│   ├── Review.ts
│   ├── User.ts
│   └── Wishlist.ts
├── framework // Server side entrypoint
│   ├── entry.browser.tsx
│   ├── entry.rsc.tsx
│   ├── entry.ssr.tsx
│   └── init.ts
├── lib
│   └── db.ts // Database wrapper
├── pages // Full page components
│   ├── admin // Admin pages
│   │   ├── reports-client.tsx
│   │   └── reports.tsx
│   ├── adminDashboard.tsx
│   ├── game.tsx
│   ├── home.tsx
│   ├── login.tsx
│   ├── not-found.tsx
│   ├── profile.tsx
│   ├── register.tsx
│   ├── searchpage.tsx
│   └── wishlist.tsx
├── root.tsx // React entrypoint and routing
├── styles // CSS stylesheets
│   ├── game-card.css
│   ├── home.css
│   ├── index.css
│   ├── variables.css
│   └── wishlist.css
├── tests // Test files
│   ├── components
│   │   └── component.test.tsx
│   ├── happydom.ts
│   ├── lib
│   │   ├── action.test.ts
│   │   ├── auth.test.ts
│   │   ├── db.test.ts
│   │   ├── jwt.test.ts
│   │   └── password.test.ts
│   ├── matchers.d.ts
│   └── testing-library.ts
└── utils // Utility functions
    ├── auth.ts
    ├── cookies.ts
    ├── jwt.ts
    ├── password.ts
    ├── request-context.ts
    ├── seed.ts
    ├── theme.ts
    ├── voice // Voice command system
    │   ├── commands.test.ts
    │   └── commands.ts
    ├── wishlist-server.ts
    └── wishlist.ts

```

## Client and Server interaction in React

In React, there are 3 types of code:

- SSR (Server Side Rendering): This refers to React Server Components which are generates on the server before being sent down as static HTML. By default, all components are server side rendered.
- Client side rendering: This refers to components which are hydrated by JavaScript running in the browser as seen in traditional React. This should generally be used for components that use slow loading data such that we have a fast initial loading speed. To make a component client side rendered, tag the file with `"use client"`.
- Server actions: These are functions tagged with `"use server"`. These functions should only be called by client side components. Behind the scenes, React automatically generates API endpoints to react the server for this data.

## On security

Server-only functions should take a `Request` parameter, even if unused. This ensures that they are not accidentally used on client side components, which could lead to security flaws such as authentication bypass. Server-only functions **should never** be tagged with `"use server"`. See ["When perfect code fails"](https://marma.dev/articles/2025/when-perfect-code-fails).

A server action (not to be confused with server-only functions), when used on client side magically generates an RPC API. **Do not** use `eval` or other unsafe operations on user input in server side code as that could lead to full compromise and data leaks.

The database handler should never be directly accessed by client side components as that would expose us to arbitrary input. All database operations should be wrapped in type-safe code under `lib/db.ts` with `"use server"` enabled.

### Authentication

We're using JWTs that last 7 days. See `src/utils/auth.ts`. To handle revocations, we should use a Bloom filter for efficiency and limiting memory use.

## Formatting and style

We use [biome](https://biomejs.dev/). Ensure that is run before requesting review. You can use the `pre-commit` hook already in the repository, or simply run `bun run format`. Ensure no warnings or errors are flagged.

## Voice commands (Accessibility)

To ensure the application can be used entirely with voice commands, all actions on the page should be registered with the voice command system. See `src/utils/voice/commands.ts`.

### VoiceCommandManager

The `VoiceCommandManager` class handles speech recognition and command matching using the Web Speech API. It supports three states: `idle`, `listening`, and `processing`.

### Registering a command

Commands are registered using the `registerCommand` method:

```ts
const vcManager = new VoiceCommandManager();
vcManager.registerCommand({
  label: "Log in",
  callback: (input: string | null) => {
    // Navigate to login page or perform action
  },
  matches: [/^Log in/i],
  hasInput: false,
});
```

### Command interface

```ts
interface Command {
  label: string;                              // Display name for the command
  callback: (input: string | null) => void;   // Function to execute when matched
  matches: RegExp[];                          // Regex patterns to match spoken input
  hasInput: boolean;                          // Whether the command captures input
}
```

### Commands with input

For commands that need to capture user input, set `hasInput: true` and use a capture group in your regex:

```ts
vcManager.registerCommand({
  label: "Search for",
  callback: (input: string | null) => {
    if (input) {
      // Search for the captured input
      navigateToSearch(input);
    }
  },
  matches: [/^Search for (.+)/i],
  hasInput: true,
});
```

### Using callbacks

The manager supports optional callbacks for state changes, errors, and command matching:

```ts
const vcManager = new VoiceCommandManager({
  onStateChange: (state) => console.log("State:", state),
  onError: (error) => console.error("Error:", error),
  onTranscript: (transcript) => console.log("Heard:", transcript),
  onCommandMatched: (command, input) => console.log("Matched:", command.label),
  onNoMatch: (transcript) => console.log("No match for:", transcript),
});
```

### Component integration

Use the `VoiceCommandProvider` component (`src/components/voice-command-provider.tsx`) to provide voice command context to your React components. Register page-specific commands using `voice-navigation-commands.tsx` as a reference.

### Managing commands

```ts
vcManager.unregisterCommand("Log in");  // Remove a specific command by label
vcManager.clearCommands();               // Remove all commands
vcManager.getCommands();                 // Get all registered commands
```

### Checking support

```ts
if (vcManager.isSupported()) {
  vcManager.startRecognition();
}
```

## Docker/Podman

By default, `podman compose up` uses any existing cached image. If you've made changes since the last build, you can run `podman compose build` to ensure the image is up to date. For a complete refresh/rerun, ensure you run these commands: `podman compose down` -> `podman volume prune` (to delete the database) -> `podman compose build` -> `podman compose up`.
