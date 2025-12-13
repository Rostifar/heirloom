import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { SessionManager } from '../lib/session-manager.js';

export const EndCommand: React.FC = () => {
	const [message, setMessage] = useState('');

	useEffect(() => {
		const currentSession = SessionManager.getCurrentSession();

		if (currentSession) {
			SessionManager.interruptSession(currentSession.id);
			const duration = currentSession.actualDuration || 0;
			setMessage(`Session ended. You focused for ${duration} minute${duration !== 1 ? 's' : ''}.`);
		} else {
			setMessage('No active session found.');
		}

		// Exit after displaying message
		setTimeout(() => {
			process.exit(0);
		}, 100);
	}, []);

	return <Text color="yellow">{message}</Text>;
};
