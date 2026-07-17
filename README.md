# Platfrom-Sf-0001

Next.js app with Prisma and PostgreSQL.

## Team Workflow

1. Clone the repo:

```powershell
git clone https://github.com/FDT-Server/Platfrom-Sf-0001.git
cd Platfrom-Sf-0001
```

2. Install dependencies:

```powershell
npm install
```

3. Create a local environment file:

- Copy `.env.example` to `.env.local`
- Fill in your own values
- Do not commit `.env.local`

4. Start the app:

```powershell
npm run dev
```

## Database Notes

- `npm run dev` starts the Next.js app only.
- If you need to sync Prisma manually, use:

```powershell
npm run db:push
```

- Be careful with Prisma schema changes on the shared database.
- This project can warn about dropping existing tables, so coordinate database changes before running them.

## Branching

- Keep `main` stable.
- Create a branch for each task, for example:

```powershell
git checkout -b feature/login-form
```

- Push your branch and open a pull request.
- Review before merging into `main`.

## Suggested Team Rules

- One person owns database schema changes.
- Use separate feature branches for each task.
- Keep secrets in `.env.local` only.
- Do not commit API keys, passwords, or private URLs.

## Useful Scripts

```powershell
npm run dev
npm run db:push
npm run build
npm run start
npm run lint
```
