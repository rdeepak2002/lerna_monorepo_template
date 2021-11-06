# project_m

## Author

Deepak Ramalingam

## About

Monorepo for project_m

## Requirements

- node
- npm
- yarn

## Environment Variables

Refer to "Credentials" Google Document in shared
folder (https://docs.google.com/document/d/1ZTHa12NW0IFtQ4L_nij4jsJFqsepUqTBLBQO18OGfro/edit)

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

## API

Link to Postman Workspace: https://www.postman.com/deepdev/workspace/project-m/overview

## Issue with Redis?

Run Redis locally on the machine.

Mac OS X:

```shell
brew install redis
brew services start redis
```

Then remove the REDIS_URI, REDIS_PORT, and REDIS_PASSWORD environment variables.
