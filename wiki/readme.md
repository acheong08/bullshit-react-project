# Project Guide

## Tech Stack

- **Full stack framework** React + Server Components
- **Database**: PostgreSQL with TypeORM
- **Testing**: Bun test with happy-dom and @testing-library
- **Documentation**: TypeDoc
- **Deployment**: Podman and compose

See [alternatives considered](./techstack-alternatives)

## Getting it running

To clone the repository locally, run:

```bash
git clone https://git.cardiff.ac.uk/c22067305/team_9_year_3_project.git
```

This project uses Git LFS to store larger files (like images) to reduce bloating in the repository.
After cloning, install and pull LFS files to ensure these files load correctly:

```bash
git lfs install
git lfs pull
```

`podman compose up -d`

(Note: Docker can be used in place of podman)

Server will be running on `http://127.0.0.1:8000`

## Configuration

The project provides a `.env.example` for reference. The environment variables should be put in a `.env` file. The project should automatically load the file via `dotenv`

```bash
# Database Configuration
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=test
POSTGRES_USER=test
POSTGRES_PASSWORD=test
POSTGRES_LOGGING=false
POSTGRES_SYNCHRONIZE=true

# JWT Configuration
# IMPORTANT: Change this to a long random string in production!
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRY=7d

# Admin User Seeding (Optional)
# If set, an admin user will be created automatically on startup
# Use scripts/generate-admin-hash.ts to generate a password hash. You may have to escape some dollar signs to get it working.
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=
ADMIN_EMAIL=admin@example.com
```

<details>

<summary><h2>Running without Docker</h2></summary>

This are commands for setting running the application without docker so you will need to have cloned the project repository to your local machine.
We have an application that is able to be dockerized, however for those users who want to run the project without docker here are some instructions to help you get set up.

Setting up bun - no need to use npm anymore! Linking buns website in as the information may change. They cover how to install and setup bun on all operating systems ["Bun documentation - installation"](`https://bun.com/docs/installation`).

Once you can successfully run `bun --version` and its installed the next thing to do it navigate to the project directory on your local machine.

Enter `bun install` which reads the existing package.json and installs all the project dependencies into `node_modules`.

Finally run `bun run dev` and you should have an instance running locally on your machine. It should provide you with a link to put into a web browser. By default vite dev server runs on port `5173` so the link should be something like `http://localhost:5173`.

### Installing and initializing PostgreSQL

Here are the links for PostgreSQL main website

["MacOS Download link"](https://www.postgresql.org/download/macosx/)
["Windows Download link"](https://www.postgresql.org/download/windows/)
For Linux, navigate to ["Download Screen"](https://www.postgresql.org/download/) and select the flavour of Linux you use and download accordingly.

Follow the installer instructions, during the installation:

- Choose a data directory (default works fine)
- Set a password for default superuser account (make a note of it as you don't want to forget this).

On Windows/MacOS, the installer generally sets PostgreSQL to run as a service automatically.

On Linux run `sudo systemctl start postgressql`. Confirm its running by entering `sudo systemctl status postgresql`.

On the running instance you now have of PostgreSQL you should create a database. Run `CREATE DATABASE <db_name>;`

TypeORM will automatically create the required tables and migrations.

</details>

## Testing

Run all tests using:

```bash
bun run test
```

**Important:** Use `bun run test` instead of `bun test` directly. The test script runs different test suites with their appropriate configurations:

- `src/tests/lib/` - Library/utility tests (default bun test config)
- `src/tests/components/` - Component tests using happy-dom (requires `bunfig.component.toml`)

The test suite uses:
- **Bun test** - Native test runner
- **happy-dom** - DOM implementation for component testing
- **@testing-library/react** - React component testing utilities

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
