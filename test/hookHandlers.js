'use strict';

const tap = require('tap');
const expect = require('expect.js');
const libModule = require('../lib');

tap.mochaGlobals();

describe('register function hook handlers', () => {
	let hookActionHandlersMap;
	let migratorHooks;
	let handlerParams;
	let migrationParamsLogger;
	let loggedMessage;

	const beforeDescribe = () => {
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

		return libModule.register({migratorHooks});
	};

	describe('beforeMigrate and afterMigrate handlers', () => {
		before(beforeDescribe);

		it('shoud be attached to migrator hooks after register', () => {
			expect(hookActionHandlersMap).keys(['beforeMigrate', 'afterMigrate']);
		});


		it('beforeMigrate should be done without errors', () => {
			return hookActionHandlersMap.beforeMigrate();
		});

		it('afterMigrate should be done without errors', () => {
			return hookActionHandlersMap.afterMigrate(handlerParams);
		});

		it('afterMigrate log migrate action duration', () => {
			const messageRegExp = new RegExp(
				`Action migrate of "${handlerParams.migration.name}" ` +
				'done in \\d+ms'
			);

			expect(loggedMessage).match(messageRegExp);
		});
	});

	describe('beforeMigrate and migrateError handlers', () => {
		before(beforeDescribe);

		it('shoud be attached to migrator hooks after register', () => {
			expect(hookActionHandlersMap).keys(['beforeMigrate', 'migrateError']);
		});

		it('beforeMigrate should be done without errors', () => {
			return hookActionHandlersMap.beforeMigrate();
		});

		it('migrateError should be done without errors', () => {
			return hookActionHandlersMap.migrateError(handlerParams);
		});

		it('migrateError log migrate action duration', () => {
			const messageRegExp = new RegExp(
				`Action migrate of "${handlerParams.migration.name}" ` +
				'failed in \\d+ms'
			);

			expect(loggedMessage).match(messageRegExp);
		});
	});

	describe('beforeRollback and afterRollback handlers', () => {
		before(beforeDescribe);

		it('shoud be attached to migrator hooks after register', () => {
			expect(hookActionHandlersMap).keys(['beforeRollback', 'afterRollback']);
		});

		it('beforeRollback should be done without errors', () => {
			return hookActionHandlersMap.beforeRollback();
		});

		it('afterRollback should be done without errors', () => {
			return hookActionHandlersMap.afterRollback(handlerParams);
		});

		it('afterRollback log rollback action duration', () => {
			const messageRegExp = new RegExp(
				`Action rollback of "${handlerParams.migration.name}" ` +
				'done in \\d+ms'
			);

			expect(loggedMessage).match(messageRegExp);
		});
	});

	describe('beforeRollback and rollbackError handlers', () => {
		before(beforeDescribe);

		it('shoud be attached to migrator hooks after register', () => {
			expect(hookActionHandlersMap).keys(['beforeRollback', 'rollbackError']);
		});

		it('beforeRollback should be done without errors', () => {
			return hookActionHandlersMap.beforeRollback();
		});

		it('rollbackError should be done without errors', () => {
			return hookActionHandlersMap.rollbackError(handlerParams);
		});

		it('rollbackError log rollback action duration', () => {
			const messageRegExp = new RegExp(
				`Action rollback of "${handlerParams.migration.name}" ` +
				'failed in \\d+ms'
			);

			expect(loggedMessage).match(messageRegExp);
		});
	});
});
