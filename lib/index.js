'use strict';

exports.register = (registerParams) => {
	const migratorHooks = registerParams.migratorHooks;

	let startDate;

	const createFinishHandler = (handlerParams) => {
		const actionName = handlerParams.actionName;
		const status = handlerParams.status;

		return (params) => {
			const duration = Date.now() - startDate;

			const migration = params.migration;
			const migrationParams = params.migrationParams;

			const logger = migrationParams.logger || console;

			logger.log(
				`Action ${actionName} of "${migration.name}" ${status} ` +
				`in ${duration}ms`
			);
		};
	};

	migratorHooks.on('beforeMigrate', () => {
		startDate = Date.now();
	});
	migratorHooks.on(
		'afterMigrate',
		createFinishHandler({actionName: 'migrate', status: 'done'})
	);
	migratorHooks.on(
		'migrateError',
		createFinishHandler({actionName: 'migrate', status: 'failed'})
	);

	migratorHooks.on('beforeRollback', () => {
		startDate = Date.now();
	});
	migratorHooks.on(
		'afterRollback',
		createFinishHandler({actionName: 'rollback', status: 'done'})
	);
	migratorHooks.on(
		'rollbackError',
		createFinishHandler({actionName: 'rollback', status: 'failed'})
	);
};
