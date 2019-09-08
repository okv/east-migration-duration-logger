# east migration duration logger

[East](https://github.com/okv/east) (node.js database migration tool)
plugin which logs duration of every migration.

[![Build Status](https://travis-ci.org/okv/east-migration-duration-logger.svg?branch=master)](https://travis-ci.org/okv/east-migration-duration-logger)
[![Coverage Status](https://coveralls.io/repos/github/okv/east-migration-duration-logger/badge.svg)](https://coveralls.io/github/okv/east-migration-duration-logger)
[![Npm version](https://img.shields.io/npm/v/east-migration-duration-logger.svg)](https://www.npmjs.org/package/east-migration-duration-logger)


## Installation

```sh
npm install east-migration-duration-logger
```


## Usage

Add this plugin to the `plugins` section to `.eastrc` e.g.:

```json
{
  "plugins": ["east-migration-duration-logger"]
}
```

That's it, after that duration of migrate, rollback actions will be logged
to the output e.g.:

```
> east migrate
arget migrations:
	1_doSomething
	2_doSomethingElse
Migrate "1_doSomething"
Action migrate of "1_doSomething" done in 206ms
Migration done
Migrate "2_doSomethingElse"
Action migrate of "2_doSomethingElse" done in 1ms
Migration done
```
