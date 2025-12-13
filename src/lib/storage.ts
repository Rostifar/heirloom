import fs from 'fs';
import path from 'path';
import type { Session, SessionData } from '../types/index.js';
import { getStoragePath } from '../utils/paths.js';

export function loadSessions(): Session[] {
	const filePath = getStoragePath();

	try {
		if (!fs.existsSync(filePath)) {
			// Initialize directory and file
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
			fs.writeFileSync(filePath, JSON.stringify({ sessions: [] }, null, 2));
			return [];
		}

		const data = fs.readFileSync(filePath, 'utf-8');
		const parsed: SessionData = JSON.parse(data);
		return parsed.sessions || [];
	} catch (error) {
		console.error('Error loading sessions:', error);
		return [];
	}
}

export function saveSessions(sessions: Session[]): void {
	const filePath = getStoragePath();
	const data: SessionData = { sessions };

	try {
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error('Error saving sessions:', error);
	}
}
