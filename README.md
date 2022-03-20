# Turborepo comment section

Repository I used to experiment with turborepo and built a comment section. It contains 5 packages; `api`, `app`, `config`, `scripts` and `ui`.

## Installation

Clone the project, have node installed and run:

```
yarn
```

### Start the project

If you want to run the application locally, have docker installed locally and run:

```
yarn dev
```

This root turbo script will run all of the dev commands in each package, and start up all of the required development servers.

### Deploy

This repository has been deployed to heroku. In order to prepare for a deploy, we run:

```
yarn build
```

This root turbo script will run all of the builds, but will take into account the dependencies specified in `turbo.json`.
This will make it so before building the API, we'll first build the `app`, copy the assets to the `api`, and only then build the `api`.
