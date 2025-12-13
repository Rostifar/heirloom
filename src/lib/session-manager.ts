import { v4 as uuidv4 } from 'uuid';
import { loadSessions, saveSessions } from './storage.js';
import type { Session } from '../types/index.js';

export class SessionManager {
	static createSession(minutes: number, description?: string): Session {
		const sessions = loadSessions();

		// Check for existing active session
		const activeSession = sessions.find(s => s.status === 'active');
		if (activeSession) {
			throw new Error('An active session already exists. Please end it first with "heirloom end".');
		}

		// Validate time input
		if (minutes <= 0 || !Number.isFinite(minutes)) {
			throw new Error('Time must be a positive number of minutes.');
		}

		const newSession: Session = {
			id: uuidv4(),
			startTime: new Date().toISOString(),
			plannedDuration: minutes,
			description,
			status: 'active',
			completedSuccessfully: false,
		};

		sessions.push(newSession);
		saveSessions(sessions);
		return newSession;
	}

	static completeSession(id: string): void {
		const sessions = loadSessions();
		const session = sessions.find(s => s.id === id);

		if (session) {
			session.endTime = new Date().toISOString();
			session.status = 'completed';
			session.actualDuration = session.plannedDuration;
			session.completedSuccessfully = true;
			saveSessions(sessions);
		}
	}

	static interruptSession(id: string): void {
		const sessions = loadSessions();
		const session = sessions.find(s => s.id === id);

		if (session) {
			const now = new Date();
			const start = new Date(session.startTime);
			session.endTime = now.toISOString();
			session.status = 'interrupted';
			session.actualDuration = Math.floor((now.getTime() - start.getTime()) / 60000);
			session.completedSuccessfully = false;
			saveSessions(sessions);
		}
	}

	static getCurrentSession(): Session | null {
		const sessions = loadSessions();
		return sessions.find(s => s.status === 'active') || null;
	}
}
