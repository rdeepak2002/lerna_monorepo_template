# lerna_monorepo_template

## Author

Deepak Ramalingam

## About

Template for a lerna monorepo

## Requirements

- node
- npm
- yarn

## Environment Variables

- JWT_SECRET (Secret string to encode JWT tokens)
- REFRESH_JWT_SECRET (Secret string to encode refresh JWT tokens)
- DB_URI (MongoDB URI)
- REDIS_URI (URI of Redis instance)
- REDIS_PORT (Port of Redis instance)
- REDIS_PASSWORD (Password for Redis instance)

## Get Started

```
yarn install
yarn start
```

Web App: http://localhost:3000/
Auth Server: http://localhost:8080/
Resource Server: http://localhost:8081/

## Issue with Redis?

Run Redis locally on the machine.

Mac OS X:

```shell
brew install redis
brew services start redis
```

Then remove the REDIS_URI, REDIS_PORT, and REDIS_PASSWORD environment variables.
