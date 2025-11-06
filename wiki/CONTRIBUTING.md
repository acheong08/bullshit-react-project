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

`root.tsx` is the entrypoint to our webpage and handles routing to the various subpages, located under `pages/`. Reusable components should be placed in `components/`.

## Server components and security

By default, all components are server side rendered unless `"use client"` is specified.

Server-only functions should either take in a `Request` parameter when used in SSR or have the file be labelled as `"use server"` for use in client-side rendering. A server-side function used on client side magically generates an RPC API. **Do not** use `eval` or other unsafe operations on user input in server side code as that could lead to full compromise and data leaks.

The database handler should never be directly accessed by client side code as that would expose us to arbitrary input. All database operations should be wrapped in type-safe code under `utils/db/` with `"user server"` enabled.

## Formatting and style

We use [biome](https://biomejs.dev/). Ensure that is run before requesting review. You can use the `pre-commit` hook already in the repository, or simply run `bun run format`. Ensure no warnings or errors are flagged.
