## Tech Stack

- **Full stack framework** React + Server Components (w/ Typescript)
- **Database**: PostgreSQL with TypeORM
- **Builder**: Bun
- **Testing**: Bun test with happy-dom and @testing-library
- **Deployment**: Podman/Docker + compose

See [Alternatives considered](wiki/Alternatives.md)

See [Additional Learning Resources](wiki/LearningResources.md)

## Programming Language: Typescript
Docs:

Typescript - [https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

Javascript - [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

- Typescript is a super-set of Javascript, with enforced typing, this makes it easier to identify bugs due to faulty typing, which is common when writing Javascript.

## Front-end: React

Docs: [https://react.dev/learn](https://react.dev/learn)

- More widely adopted than Svelte, more community support
- Team members more familiar with React

## Back-end: React Server Components

Docs: [https://react.dev/reference/rsc/server-components](https://react.dev/reference/rsc/server-components)

- Allows for a more unified codebase between front-end and back-end, fitting cleaner into our single, unified, monolith architecture.
- Easier data fetching and state management, as server components can directly access the database and server-side logic without needing to set up separate API routes

## Database: PostgreSQL with TypeORM

Docs:

PostgreSQL - [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)

TypeORM - [https://typeorm.io/docs/getting-started](https://typeorm.io/docs/getting-started)


- PostgreSQL is a powerful, open-source relational database with strong community support and a wide range of features. For example: We used a PostgreSQL native feature `Materialized Views` in this project.
- Team members have prior experience with PostgreSQL.
- We chose to use an ORM (TypeORM) to simplify database interactions and improve developer productivity, as it allows us to work with database entities as objects in our code rather than writing raw SQL queries. Although Plain SQL can offer more control and potentially better performance, the benefits of using an ORM for our project outweighed these considerations.
- We considered 3 Typescript ORMs, Prisma, Dizzle ORM and TypeORM, and as a team we decided we preferred the syntax of TypeORM.

## Builder: Bun
Docs: [https://bun.com/docs](https://bun.com/docs)

- Bun is a modern JavaScript runtime that offers fast performance and built-in tooling, including a package manager, bundler, and test runner.
- Chose Bun over NPM due to its speed and integrated features, which can streamline our development workflow. It is also completely compatible with NPM, so minimal support is lost.

## Testing: Bun test with happy-dom and @testing-library
Docs:

Bun test - [https://bun.com/docs/test](https://bun.com/docs/test)

happy-dom - [https://github.com/capricorn86/happy-dom/wiki/](https://github.com/capricorn86/happy-dom/wiki/)

@testing-library/react - [https://testing-library.com/docs/react-testing-library/intro/](https://testing-library.com/docs/react-testing-library/intro/)


- Bun test is a fast and efficient testing framework that integrates well with Bun.
- happy-dom provides a lightweight DOM implementation for testing React components in a Node.js environment. It is essentially a more modern equivalent of JSDom.
- @testing-library just adds some nice functions to work with.

## Deployment: Podman/Docker + Compose
Docs:

Docker - [https://docs.docker.com/](https://docs.docker.com/)

Docker Compose - [https://docs.docker.com/compose/](https://docs.docker.com/compose/)

Podman - [https://docs.podman.io/en/latest/](https://docs.podman.io/en/latest/)

Podman Compose - [https://docs.podman.io/en/latest/markdown/podman-compose.1.html](https://docs.podman.io/en/latest/markdown/podman-compose.1.html)


- Podman and Docker are interoperable, that have almost exactly the same syntax.
- Podman/Docker allows for containerization of the application, making it easier to deploy and manage dependencies, and also solves the classic "well it works on my machine" problem.
- Compose simplifies the process of defining and running multi-container applications, allowing us to easily manage our application stack (web server, database, etc.)
