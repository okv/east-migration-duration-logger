'use strict';

const test = require('tape-catch');
const libModule = require('../lib');

test('Lib: module', (assert) => {
	assert.equal(
		typeof libModule.register,
		'function',
		'should export register function'
	);

	assert.equal(
		libModule.register.length,
		1,
		'should export funct which accepts single arg'
	);

	assert.end();
});

test('Lib: register function', (assert) => {
	const hookActionHandlersMap = {};
	let migratorHooks;

	const setup = () => {
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
	};

	setup();

	assert.doesNotThrow(
		() => libModule.register({migratorHooks}),
		'shoud be done without errors'
	);

	const actionNames = [
		'beforeMigrate', 'afterMigrate', 'migrateError',
		'beforeRollback', 'afterRollback', 'rollbackError'
	].sort();

	assert.deepEqual(
		Object.keys(hookActionHandlersMap).sort(),
		actionNames
	);
	actionNames.forEach((actionName) => {
		assert.equal(
			typeof hookActionHandlersMap[actionName],
			'function'
		);
	});

	assert.end();
});
