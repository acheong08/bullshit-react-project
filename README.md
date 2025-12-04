Some random bullshit coursework.

Setting it up is easy:
- `cp .env.example .env`
- Edit .env as you please
- `podman run --name psql -d -p 127.0.0.1:5432:5432 -e "POSTGRES_DB=test" -e "POSTGRES_USER=test" -e "POSTGRES_PASSWORD=test" docker.io/library/postgres:18`
- `bun run build`
- `bun run preview`

Uploaded as backup and reference.
