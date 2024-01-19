# 🪩 Weekendr: Easy-To-Use Night Club/Party Finder
**Weekendr** is the ultimate tool for finding night clubs in your area. Whether you're into Techno, Hip-Hop, Metal (or whatever genre of music for that matter) *doesn't matter*. 

Use the *music genre filter* to find the music you want to listen to on the weekend with your friends.

## 💪 Motivation
I came up with the idea for Weekendr one day when I figured I didn't know many night clubs in my small home town. The problem is even if I knew I would have to check each night club's Instagram page to know which genre of music they would be playing over the weekend to know where I wanted to go. So I figured that wasn't ideal.

I tried searching online for a web application that could help me with my problem, but I couldn't find one. That's when I figured I needed to use my programming knowledge to good use. What started out as a small project I started solo later on I got help from one of my good [friends](https://github.com/zvonimirr) from college.

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
