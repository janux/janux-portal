# janux-portal

## Overview

A full-stack demo/seed application for identity management. Vue.js frontend
with an Express backend. Demonstrates janux-people and janux-authorize in
action.

## Tech Stack

### Client (janux-vuejs-demo)
- **Framework**: Vue.js 2.7.16 + Vuex 3.6 + Vue Router 3.6
- **UI**: Vue-Material 1.0.0-beta-16 + Bootstrap 3.4.1
- **Build**: Vite 7.3.6 (`@vitejs/plugin-vue2`) — replaced gulp/webpack 3;
  see `doc/2026-09-07.vite-migration.md` for why and what changed
- **Templates**: Pug
- **Styles**: LESS
- **Test**: Vitest 5 + jsdom + @vue/test-utils
- **Lint**: ESLint 10, flat config (`eslint.config.js`)
- **Node**: >= 22.0.0

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
npm run build        # builds client (vite build)
npm run watch        # dev mode: server (node --watch) + client (vite), via concurrently

# Seed data
npm run generate-demo-users
npm run generate-demo-auth
```

## Server test suite: no `npm test` existed, two dead specs removed

Found while wiring up `npm run coverage` (nyc + `.nycrc.json`, same pattern
as the other janux/easytitle24/glarus servers): `server/package.json` had
no `test` script at all, and two of its four specs failed outright:

- `test/auth/authorization-service.spec.js` required `src/auth
  /authorization-service.js`, which has never existed. The route that
  would have used it (`GET /authenticationContexts` in `route/auth.js`)
  is itself commented out ("TODO: fix this, since we are using
  promises"). Removed — dead seed-template scaffolding for a feature
  that was never built, not a regression.
- `test/auth/user-service-mock.spec.js` tested `src/auth
  /user-service-mock.js`, which itself `require`s that same missing
  `./authorization-service` and calls `.loadRoles()` at module-load
  time — so simply requiring this file throws. It isn't required
  anywhere else in the app (not from any route, `server.js`, or
  `src/api/index.js`), so it's dead, unreachable, and currently broken
  if it were ever required. Removed the spec; left the source file in
  place (production-code removal is a separate call from cleaning up
  its test) — it'll show as 0% in the coverage report, which is an
  accurate reflection of "unused."
- `test/api/user-service.spec.js` required `src/api/user-service.js`
  directly (the raw `.create(dependency)` factory, not a usable
  instance) and called a `findByUsername` method that doesn't exist.
  Fixed to go through `src/api/index.js`'s wired-up instance instead,
  same as every route does, and to call `findBy('username', ...)`,
  the current equivalent.

After these fixes the suite is a clean 4 passing, 0 failing. Baseline:
40.22% statements / 10% branches / 16.9% functions / 40.42% lines.

## Notes

- Git branch: `dev`, remote: github.com/janux/janux-portal
- Database: MongoDB (configured in server/config/)
- Monorepo structure with client/ and server/ subdirectories
- This is a demo/seed application, not deployed in production, so it is the
  lowest-priority project in the janux group.
- The client build moved from gulp 3.9.1 + webpack 3 + karma/PhantomJS to
  Vite 7 + `@vitejs/plugin-vue2` + Vitest (branch `dev-vite-build`); see
  `doc/2026-09-07.vite-migration.md` for the reasoning and every
  compatibility fix that required. `eslint.config.js` (flat config, new
  with this move) also surfaces real pre-existing issues in the app code
  — see that doc's "Left as-is" section — not fixed as part of the build
  change.

## Next steps

- TypeScript 5 / Vue 3 is the natural follow-on target once this build
  lands, but is blocked on replacing Vue-Material (no Vue 3 release; all
  31 SFCs use `md-*` components) — a separate UI-library swap, not a
  build-tool change.
- `server/`'s own dependencies (Express 4.13.4, Mongoose 4.4.14, MongoDB
  driver 2.1.18) are untouched by the Vite migration and still reflect the
  original Node 6-era baseline; modernizing them is separate work.
- The five dead AngularJS specs under `client/test/common/security/` and
  the `vue/no-mutating-props` bugs the new lint config surfaced are both
  real, scoped follow-ups — see `doc/2026-09-07.vite-migration.md`.
