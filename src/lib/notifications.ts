import notifier from 'node-notifier';
import { exec } from 'child_process';

export function sendNotification(title: string, message: string): void {
	// On macOS, use osascript for more reliable notifications
	if (process.platform === 'darwin') {
		const script = `display notification "${message}" with title "${title}" sound name "Glass"`;
		exec(`osascript -e '${script}'`, (error) => {
			if (error) {
				console.error('Notification error:', error);
				// Fallback to node-notifier
				fallbackNotification(title, message);
			}
		});
	} else {
		// Use node-notifier for other platforms
		fallbackNotification(title, message);
	}
}

function fallbackNotification(title: string, message: string): void {
	try {
		notifier.notify(
			{
				title,
				message,
				sound: true,
				wait: false,
				timeout: 10,
			},
			(error, _response) => {
				if (error) {
					console.error('Notification error:', error);
				}
			}
		);
	} catch (error) {
		console.error('Failed to send notification:', error);
	}
}
