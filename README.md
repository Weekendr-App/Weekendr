# Weekndr 

# Pre-requisites
- Node
- Docker

# Development
1. `pnpm i`
2. Configure Prisma in `apps/api/.env` and run the migrations
3. Configure the environment in `apps/webapp/.env.local`
4. Run `pnpm codegen` in `apps/webapp`
5. Run `pnpm dev` in root

NOTE: After changing urql queries/mutations don't forget to run codegen

GraphQL server is on: http://localhost:4000/graphql
Webapp is on: http://localhost:3000
