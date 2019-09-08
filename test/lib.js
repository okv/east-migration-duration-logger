'use strict';

const tap = require('tap');
const expect = require('expect.js');
const libModule = require('../lib');

tap.mochaGlobals();

describe('lib', () => {
	describe('module', () => {
		it('should export register function', () => {
			expect(libModule.register).a(Function);
		});

		it('should export funct which accepts single arg', () => {
			expect(libModule.register.length).equal(1);
		});
	});

	describe('register function', () => {
		const hookActionHandlersMap = {};
		let migratorHooks;

		before(() => {
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
		});

		it('shoud be done without errors', () => {
			return libModule.register({migratorHooks});
		});

		it('shoud subscribe on migration hooks', () => {
			const actionNames = [
				'beforeMigrate', 'afterMigrate', 'migrateError',
				'beforeRollback', 'afterRollback', 'rollbackError'
			];

			expect(hookActionHandlersMap).only.keys(actionNames);
			actionNames.forEach((actionName) => {
				expect(hookActionHandlersMap[actionName]).a(Function);
			});
		});
	});
});
