# janux-portal

## Overview

A full-stack demo/seed application for identity management. Vue.js frontend
with an Express backend. Demonstrates janux-people and janux-authorize in
action.

## Tech Stack

### Client (janux-vuejs-demo)
- **Framework**: Vue.js 2.5.2 + Vuex + Vue Router
- **UI**: Vue-Material 1.0.0-beta-7 + Bootstrap 3.3.4
- **Build**: Webpack 3.11.0
- **Templates**: Pug
- **Styles**: LESS
- **Test**: Karma + Jasmine
- **Node**: >= 6.0.0

### Server (janux-auth-seed-server)
- **Framework**: Express 4.13.4
- **Database**: MongoDB (mongoose 4.4.14, mongodb 2.1.18)
- **Auth**: Passport + JWT (express-jwt, jsonwebtoken)
- **Test**: Mocha + Chai
- **API**: JSON-RPC

## Vendor Dependencies (must create symlinks)

Server expects these in `server/vendor/`, all three now siblings in `janux/`:
- janux-people.js → ../../../janux-people.js
- janux-authorize.js → ../../../janux-authorize.js
- janux-persist.js → ../../../janux-persist.js

Client references them from `../server/vendor/`.

The `server/vendor/` directory is not checked in and does not currently
exist — it has to be created before installing.

## Build & Run

```bash
# Create vendor symlinks first
mkdir -p server/vendor && cd server/vendor
ln -s ../../../janux-people.js .
ln -s ../../../janux-authorize.js .
ln -s ../../../janux-persist.js .

# Install and run
cd ../..
npm install          # installs server + client via postinstall
npm run build        # builds client
npm run watch        # dev mode

# Seed data
npm run generate-demo-users
npm run generate-demo-auth
```

## Notes

- Git branch: `dev`, remote: github.com/janux/janux-portal
- Database: MongoDB (configured in server/config/)
- Monorepo structure with client/ and server/ subdirectories
- **Still uses Gulp**, unlike the three TypeScript libraries, which have been
  migrated to plain `tsc`. The client keeps `client/gulpfile.js`,
  `client/gulp/` and gulp 3.9.1 with eight plugins; `npm run watch` at the
  root shells out to `./client/node_modules/gulp/bin/gulp.js`. This was left
  alone deliberately — the client's gulp tasks drive webpack, karma and
  jasmine rather than TypeScript compilation, so removing them is a real
  piece of work rather than a cleanup.
- This is a demo/seed application, not deployed in production, so it is the
  lowest-priority project in the janux group.
