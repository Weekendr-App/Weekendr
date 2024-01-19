# Weekendr: Easy-To-Use Night Club/Party Finder 🪩
**Weekendr** is the ultimate tool for finding night clubs in your area. Whether you're into Techno, Hip-Hop, Metal (or whatever genre of music for that matter) *doesn't matter*. 

Use the *music genre filter* to find the music you want to listen to on the weekend with your friends.

## 🚀 Quick Start

### Pre-requisites
- Node
- Docker

### Development
1. `pnpm i`
2. Configure Prisma in `apps/api/.env` and run the migrations
3. Configure the environment in `apps/webapp/.env.local`
4. Run `pnpm codegen` in `apps/webapp`
5. Run `pnpm dev` in root

NOTE: After changing urql queries/mutations don't forget to run codegen

GraphQL server is on: http://localhost:4000/graphql
Webapp is on: http://localhost:3000
