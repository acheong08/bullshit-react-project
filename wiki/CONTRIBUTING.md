# Contributing

This is a Vite + React Server Components project following the usual standards.

```
root@localhost > tree src
src
├── action.tsx
├── assets/
│   └── react.svg
├── components/
│   └── navbar.tsx
├── framework/
├── index.css
├── pages/
│   ├── game.tsx
│   ├── home.tsx
│   ├── login.tsx
│   ├── not-found.tsx
│   └── profile.tsx
├── root.tsx
└── utils/
    └── auth.ts
    └── db/
```

`root.tsx` is the entry point to our webpage and handles routing to the various sub-pages, located under `pages/`. Reusable components should be placed in `components/`.

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
