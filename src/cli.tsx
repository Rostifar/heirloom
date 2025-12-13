#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { StartCommand } from './commands/start.js';
import { EndCommand } from './commands/end.js';
import { HistoryCommand } from './commands/history.js';

const cli = meow(
	`
	Usage
	  $ heirloom <command> [options]

	Commands
	  start    Start a new focus session
	  end      End the current session
	  history  View session history and statistics

	Options
	  -t, --time <minutes>       Duration in minutes (default: 25)
	  -d, --description <text>   Task description

	Examples
	  $ heirloom start
	  $ heirloom start -t 50 -d "Write documentation"
	  $ heirloom end
	  $ heirloom history
`,
	{
		importMeta: import.meta,
		flags: {
			time: {
				type: 'number',
				shortFlag: 't',
				default: 25,
			},
			description: {
				type: 'string',
				shortFlag: 'd',
			},
		},
	}
);

const command = cli.input[0];

if (command === 'start') {
	render(<StartCommand time={cli.flags.time} description={cli.flags.description} />);
} else if (command === 'end') {
	render(<EndCommand />);
} else if (command === 'history') {
	render(<HistoryCommand />);
} else {
	cli.showHelp();
}
