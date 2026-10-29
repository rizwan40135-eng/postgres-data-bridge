# Postgres Data Bridge

Create a simple application that reads and updates data in AWS RDS PostgreSQL instead of Supabase.

I have already created the RDS database and user, and my EC2 server can connect to it. Generate a Node.js backend that uses the server-side DATABASE_URL variable from .env. Keep database credentials out of frontend code.

Include the schema migrations, sample-data loading script, and clear commands to run the application on EC2. For Lovable preview, use sample data without requiring access to RDS.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c30f5a42-67a7-483d-886a-c86167b5f147).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
