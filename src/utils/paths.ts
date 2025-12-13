import os from 'os';
import path from 'path';

export function getStoragePath(): string {
	const homeDir = os.homedir();
	const platform = process.platform;

	if (platform === 'win32') {
		return path.join(process.env.APPDATA || homeDir, 'heirloom', 'sessions.json');
	}

	// macOS and Linux
	return path.join(homeDir, '.config', 'heirloom', 'sessions.json');
}
