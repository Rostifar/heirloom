import React, { useEffect } from 'react';
import { Text, Box } from 'ink';
import { loadSessions } from '../lib/storage.js';
import { getSessionStats } from '../lib/statistics.js';
import { format } from 'date-fns';

export const HistoryCommand: React.FC = () => {
	const sessions = loadSessions();
	const stats = getSessionStats(sessions);

	useEffect(() => {
		// Exit after displaying history
		const timer = setTimeout(() => {
			process.exit(0);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	// Sort by most recent first and exclude active sessions
	const sortedSessions = [...sessions]
		.filter(s => s.status !== 'active')
		.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
		.slice(0, 20);

	if (sessions.length === 0) {
		return (
			<Box flexDirection="column" padding={1}>
				<Text>No sessions yet. Start your first session with:</Text>
				<Text color="cyan">  heirloom start -t 25 -d "Your task"</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" padding={1}>
			<Text bold underline>
				30-Day Statistics
			</Text>
			<Box marginTop={1} flexDirection="column">
				<Text>
					Success Rate: <Text color="green" bold>{stats.successRate}%</Text>
				</Text>
				<Text>Total Sessions: {stats.totalSessions}</Text>
				<Text>
					Completed: <Text color="green">{stats.completedSessions}</Text>
				</Text>
				<Text>
					Interrupted: <Text color="yellow">{stats.interruptedSessions}</Text>
				</Text>
				<Text>Total Focus Time: {Number(stats.totalMinutes.toFixed(3))} minutes</Text>
			</Box>

			<Box marginTop={2}>
				<Text bold underline>
					Recent Sessions
				</Text>
			</Box>

			{sortedSessions.length === 0 ? (
				<Box marginTop={1}>
					<Text dimColor>No sessions in the last 30 days</Text>
				</Box>
			) : (
				<Box marginTop={1} flexDirection="column">
					{sortedSessions.map(session => (
						<Text key={session.id}>
							{format(new Date(session.startTime), 'MMM dd, yyyy HH:mm')} -{' '}
							<Text color={session.completedSuccessfully ? 'green' : 'yellow'}>
								{session.status}
							</Text>{' '}
							({session.actualDuration || session.plannedDuration}m)
							{session.description && ` - ${session.description}`}
						</Text>
					))}
				</Box>
			)}
		</Box>
	);
};
