import React, { useState, useEffect } from 'react';
import { Text } from 'ink';

interface TimerProps {
	duration: number;
	onComplete: () => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
	const [secondsLeft, setSecondsLeft] = useState(duration);

	useEffect(() => {
		if (secondsLeft <= 0) {
			onComplete();
			return;
		}

		const interval = setInterval(() => {
			setSecondsLeft(prev => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [secondsLeft, onComplete]);

	const minutes = Math.floor(secondsLeft / 60);
	const seconds = secondsLeft % 60;

	return (
		<Text color="cyan" bold>
			{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
		</Text>
	);
};
