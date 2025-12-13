import { exec } from 'child_process';

export function sendNotification(title: string, message: string): void {
	if (process.platform === 'darwin') {
		// Use osascript for macOS notifications
		const script = `display notification "${message}" with title "${title}" sound name "Glass"`;
		exec(`osascript -e '${script}'`, (error) => {
			if (error) {
				console.error('Notification error:', error);
			}
		});
	} else {
		// For non-macOS platforms, just log to console
		console.log(`\n🔔 ${title}: ${message}\n`);
	}
}
