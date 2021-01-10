#!/usr/bin/env node
const chokidar = require('chokidar');
const program = require('caporal');
const debounce = require('lodash.debounce');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

program.version('0.0.1').argument('[filename]', 'Name of a file to execute').action(async ({ filename }) => {
	const name = filename || 'index.js';
	try {
		await fs.promises.access(name);
	} catch (err) {
		throw new Error(`Colud not find the file ${name}`);
	}

	// debounce add event
	let proc;
	const start = debounce(() => {
		if (proc) {
			proc.kill();
		}
		console.log(chalk.blueBright('>>>>>>Starting process...'));
		proc = spawn('node', [ name ], { stdio: 'inherit' });
	}, 100);

	//watch for event
	chokidar.watch('.').on('add', start).on('change', start).on('unlink', start);
});
program.parse(process.argv);
