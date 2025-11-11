# Project Guide

## Tech Stack

- **Full stack framework** React + Server Components
- **Database**: PostgreSQL with TypeORM
- **Testing**: Selenium and Jest
- **Documentation**: TypeDoc
- **Deployment**: Podman and compose

See [alternatives considered](./techstack-alternatives)

## Getting it running

`podman compose up -d`

(Note: Docker can be used in place of podman)

Server will be running on `http://127.0.0.1:8000`

## Running without Docker Instructions

This are commands for setting running the application without docker so you will need to have cloned the project repository to your local machine.
We have an application that is able to be dockerized, however for those users who want to run the project without docker here are some instructions to help you get set up.

Setting up bun - no need to use npm anymore! Linking buns website in as the information may change. They cover how to install and setup bun on all operating systems ["Bun documentation - installation"](`https://bun.com/docs/installation`).

Once you can successfully run `bun --version` and its installed the next thing to do it navigate to the project directory on your local machine.

Enter `bun install` which reads the existing package.json and installs all the project dependencies into `node_modules`.

Finally run `bun run dev` and you should have an instance running locally on your machine. It should provide you with a link to put into a web browser. By default vite dev server runs on port `5173` so the link should be something like `http://localhost:5173`.

## Installing and initializing PostgreSQL

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

Environment Variables to be filled in:

```bash
export PGHOST=localhost
export PGPORT=
export PGUSER=
export PGPASSWORD=
export PGDATABASE=
export PGDATABASENAME=
```

We will have a .env file to load these all for our application, then remove all the exports from environment variables above.

TypeORM will automatically create the required tables and migrations.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
