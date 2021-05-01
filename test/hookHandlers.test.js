'use strict';

const test = require('tape-catch');
const libModule = require('../lib');

let hookActionHandlersMap;
let migratorHooks;
let handlerParams;
let migrationParamsLogger;
let loggedMessage;

const setup = () => {
	hookActionHandlersMap = {};

	migratorHooks = {
		on: (actionName, handler) => {
			if (hookActionHandlersMap[actionName]) {
				throw new Error(
					`Handler for action ${actionName} already provided`
				);
			}
			hookActionHandlersMap[actionName] = handler;
		}
	};

	migrationParamsLogger = {
		log: (message) => {
			loggedMessage = message;
		}
	};

	handlerParams = {
		migration: {name: '999_test'},
		migrationParams: {logger: migrationParamsLogger}
	};

	libModule.register({migratorHooks});
};

test('Hook handlers: beforeMigrate, afterMigrate with logger ', (assert) => {
	setup();

	const actionNames = Object.keys(hookActionHandlersMap);
	assert.ok(actionNames.indexOf('beforeMigrate') !== -1);
	assert.ok(actionNames.indexOf('afterMigrate') !== -1);

	assert.doesNotThrow(
		() => hookActionHandlersMap.beforeMigrate(),
		'beforeMigrate should be done without errors'
	);

	assert.doesNotThrow(
		() => hookActionHandlersMap.afterMigrate(handlerParams),
		'afterMigrate should be done without errors'
	);

	const messageRegExp = new RegExp(
		`Action migrate of "${handlerParams.migration.name}" ` +
		'done in \\d+ms'
	);
	assert.match(
		loggedMessage,
		messageRegExp,
		'afterMigrate log migrate action duration'
	);

	assert.end();
});

test('Hook handlers: beforeMigrate, migrateError with logger', (assert) => {
	setup();

	const actionNames = Object.keys(hookActionHandlersMap);
	assert.ok(actionNames.indexOf('beforeMigrate') !== -1);
	assert.ok(actionNames.indexOf('migrateError') !== -1);

	assert.doesNotThrow(
		() => hookActionHandlersMap.beforeMigrate(),
		'beforeMigrate should be done without errors'
	);

	assert.doesNotThrow(
		() => hookActionHandlersMap.migrateError(handlerParams),
		'migrateError should be done without errors'
	);

	const messageRegExp = new RegExp(
		`Action migrate of "${handlerParams.migration.name}" ` +
		'failed in \\d+ms'
	);
	assert.match(
		loggedMessage,
		messageRegExp,
		'migrateError log migrate action duration'
	);

	assert.end();
});

test('Hook handlers: beforeRollback, afterRollback with logger', (assert) => {
	setup();

	const actionNames = Object.keys(hookActionHandlersMap);
	assert.ok(actionNames.indexOf('beforeRollback') !== -1);
	assert.ok(actionNames.indexOf('afterRollback') !== -1);

	assert.doesNotThrow(
		() => hookActionHandlersMap.beforeRollback(),
		'beforeRollback should be done without errors'
	);

	assert.doesNotThrow(
		() => hookActionHandlersMap.afterRollback(handlerParams),
		'afterRollback should be done without errors'
	);

	const messageRegExp = new RegExp(
		`Action rollback of "${handlerParams.migration.name}" ` +
		'done in \\d+ms'
	);
	assert.match(
		loggedMessage,
		messageRegExp,
		'afterRollback log rollback action duration'
	);

	assert.end();
});

test('Hook handlers: beforeRollback, rollbackError with logger', (assert) => {
	setup();

	const actionNames = Object.keys(hookActionHandlersMap);
	assert.ok(actionNames.indexOf('beforeRollback') !== -1);
	assert.ok(actionNames.indexOf('rollbackError') !== -1);

	assert.doesNotThrow(
		() => hookActionHandlersMap.beforeRollback(),
		'beforeRollback should be done without errors'
	);

	assert.doesNotThrow(
		() => hookActionHandlersMap.rollbackError(handlerParams),
		'rollbackError should be done without errors'
	);

	const messageRegExp = new RegExp(
		`Action rollback of "${handlerParams.migration.name}" ` +
		'failed in \\d+ms'
	);
	assert.match(
		loggedMessage,
		messageRegExp,
		'rollbackError log rollback action duration'
	);

	assert.end();
});

// this must be true for this and all other pair of handlers
test.test('Hook handlers: some handlers pair with console logger', (assert) => {
	setup();
	delete handlerParams.migrationParams.logger;

	const actionNames = Object.keys(hookActionHandlersMap);
	assert.ok(actionNames.indexOf('beforeMigrate') !== -1);
	assert.ok(actionNames.indexOf('afterMigrate') !== -1);

	assert.doesNotThrow(
		() => hookActionHandlersMap.beforeMigrate(),
		'beforeMigrate should be done without errors'
	);

	assert.doesNotThrow(
		() => hookActionHandlersMap.afterMigrate(handlerParams),
		'afterMigrate should be done without errors'
	);

	assert.end();
});
