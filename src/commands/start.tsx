import React, { useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import { SessionManager } from '../lib/session-manager.js';
import { sendNotification } from '../lib/notifications.js';
import { Timer } from '../components/Timer.js';

interface StartCommandProps {
	time: number;
	description?: string;
}

export const StartCommand: React.FC<StartCommandProps> = ({ time, description }) => {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [isComplete, setIsComplete] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			// Create session on mount
			const session = SessionManager.createSession(time, description);
			setSessionId(session.id);

			// Handle process interruption (Ctrl+C)
			const handleExit = () => {
				if (session.id) {
					SessionManager.interruptSession(session.id);
				}
				process.exit(0);
			};

			process.on('SIGINT', handleExit);
			return () => {
				process.off('SIGINT', handleExit);
			};
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create session');
		}
	}, [time, description]);

	const handleComplete = () => {
		if (sessionId) {
			SessionManager.completeSession(sessionId);
			sendNotification('Heirloom', 'Focus session completed! Time for a break.');
			setIsComplete(true);

			// Exit after a brief moment
			setTimeout(() => {
				process.exit(0);
			}, 1000);
		}
	};

	if (error) {
		return <Text color="red">{error}</Text>;
	}

	if (isComplete) {
		return (
			<Box flexDirection="column" padding={1}>
				<Text color="green" bold>
					✓ Session completed! Great work!
				</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" padding={1}>
			<Text bold>{description || 'Focus Session'}</Text>
			<Box marginTop={1}>
				<Timer duration={time * 60} onComplete={handleComplete} />
			</Box>
			<Box marginTop={1}>
				<Text dimColor>Press Ctrl+C to stop early</Text>
			</Box>
		</Box>
	);
};
