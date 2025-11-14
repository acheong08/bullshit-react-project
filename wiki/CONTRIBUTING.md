# Contributing

This is a Vite + React Server Components project following the usual standards.

```
root@localhost> tree src
src
├── action.tsx
├── assets
│   └── react.svg
├── client.tsx
├── components              // Reusable components
│   └── navbar.tsx
├── data-source.ts          // Production database definitions
├── entity
│   └── User.ts
├── framework               // Server side entrypoint
│   ├── entry.browser.tsx
│   ├── entry.rsc.tsx
│   └── entry.ssr.tsx
├── index.css
├── lib
│   └── db                  // Database wrapper
│       └── db.test.ts
├── pages                   // Full page components
│   ├── game.tsx
│   ├── home.tsx
│   ├── login.tsx
│   ├── not-found.tsx
│   └── profile.tsx
├── root.tsx                // React entrypoint and routing
└── utils
    └── auth.ts
```

## Client and Server interaction in React

In React, there are 3 types of code:

- SSR (Server Side Rendering): This refers to React Server Components which are generates on the server before being sent down as static HTML. By default, all components are server side rendered.
- Client side rendering: This refers to components which are hydrated by JavaScript running in the browser as seen in traditional React. This should generally be used for components that use slow loading data such that we have a fast initial loading speed. To make a component client side rendered, tag the file with `"use client"`.
- Server actions: These are functions tagged with `"use server"`. These functions should only be called by client side components. Behind the scenes, React auto magically generated API endpoints to react the server for this data.

## On security

Server-only functions should take a `Request` parameter, even if unused. This ensures that they are not accidentally used on client side components, which could lead to security flaws such as authentication bypass. Server-only functions **should never** be tagged with `"use server"`. See ["When perfect code fails"](https://marma.dev/articles/2025/when-perfect-code-fails).

A server action (not to be confused with server-only functions), when used on client side magically generates an RPC API. **Do not** use `eval` or other unsafe operations on user input in server side code as that could lead to full compromise and data leaks.

The database handler should never be directly accessed by client side components as that would expose us to arbitrary input. All database operations should be wrapped in type-safe code under `utils/db/` with `"user server"` enabled.

## Formatting and style

We use [biome](https://biomejs.dev/). Ensure that is run before requesting review. You can use the `pre-commit` hook already in the repository, or simply run `bun run format`. Ensure no warnings or errors are flagged.

## Voice commands (Accessibility)

To ensure the application can be used entirely with voice commands, all actions on the page should be registered with the voice command system. See `src/utils/voice/commands.ts`

```ts
const vcManager = new VoiceCommandManager();
vcManager.registerCommand({
  callback: (input: string | null) => {
    // Navigate to login page or enter form depending on page
  },
  hasInput: false,
  label: "Log in",
  matches: [/^Log in/i],
});
```

## Docker/podman

By default, `podman compose up` uses any existing cached image. If you've made changes since the last build, you can run `podman compose build` to ensure the image is up to date.
