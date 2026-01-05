import React, { useEffect } from 'react';
import { Text, Box } from 'ink';
import { loadSessions } from '../lib/storage.js';
import { getSessionStats, getDailyStats, getLast30DaysFocusData, type DailyFocusData } from '../lib/statistics.js';
import { format } from 'date-fns';

const GRAPH_HEIGHT = 8;
const BLOCKS = [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

function renderFocusGraph(data: DailyFocusData[]): React.ReactNode {
	const maxMinutes = Math.max(...data.map(d => d.minutes), 1);

	// Build the graph rows from top to bottom
	const rows: React.ReactNode[] = [];

	for (let row = GRAPH_HEIGHT; row >= 1; row--) {
		const threshold = (row / GRAPH_HEIGHT) * maxMinutes;
		const prevThreshold = ((row - 1) / GRAPH_HEIGHT) * maxMinutes;

		const rowChars = data.map((d, i) => {
			if (d.minutes >= threshold) {
				return <Text key={i} color="green">█</Text>;
			} else if (d.minutes > prevThreshold) {
				// Partial block
				const fraction = (d.minutes - prevThreshold) / (threshold - prevThreshold);
				const blockIndex = Math.round(fraction * (BLOCKS.length - 1));
				return <Text key={i} color="green">{BLOCKS[blockIndex]}</Text>;
			} else {
				return <Text key={i}> </Text>;
			}
		});

		rows.push(
			<Box key={row}>
				<Text dimColor>{String(Math.round(threshold)).padStart(4)}m </Text>
				{rowChars}
			</Box>
		);
	}

	// Add date range label
	const startDate = format(data[0]?.date ?? new Date(), 'MMM dd');
	const endDate = format(data[data.length - 1]?.date ?? new Date(), 'MMM dd');
	rows.push(
		<Box key="range">
			<Text dimColor>     {startDate.padEnd(15)}{endDate.padStart(15)}</Text>
		</Box>
	);

	return rows;
}

export const HistoryCommand: React.FC = () => {
	const sessions = loadSessions();
	const stats = getSessionStats(sessions);
	const dailyStats = getDailyStats(sessions);
	const focusData = getLast30DaysFocusData(sessions);

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
			<Box marginTop={1} flexDirection="column">
				{renderFocusGraph(focusData)}
			</Box>

			<Box marginTop={2}>
				<Text bold underline>
					Daily Statistics
				</Text>
			</Box>
			<Box marginTop={1} flexDirection="column">
				<Text>
					Success Rate: <Text color="green" bold>{dailyStats.successRate}%</Text>
				</Text>
				<Text>Total Sessions: {dailyStats.totalSessions}</Text>
				<Text>
					Completed: <Text color="green">{dailyStats.completedSessions}</Text>
				</Text>
				<Text>
					Interrupted: <Text color="yellow">{dailyStats.interruptedSessions}</Text>
				</Text>
				<Text>Total Focus Time: {dailyStats.totalMinutes} minutes</Text>
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
