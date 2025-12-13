import { subDays, isAfter } from 'date-fns';
import type { Session, SessionStats } from '../types/index.js';

export function calculate30DaySuccessRate(sessions: Session[]): number {
	const thirtyDaysAgo = subDays(new Date(), 30);

	const recentSessions = sessions.filter(
		s => isAfter(new Date(s.startTime), thirtyDaysAgo) && s.status !== 'active'
	);

	if (recentSessions.length === 0) return 0;

	const successfulSessions = recentSessions.filter(s => s.completedSuccessfully);

	return Math.round((successfulSessions.length / recentSessions.length) * 100);
}

export function getSessionStats(sessions: Session[]): SessionStats {
	const thirtyDaysAgo = subDays(new Date(), 30);
	const recentSessions = sessions.filter(
		s => isAfter(new Date(s.startTime), thirtyDaysAgo) && s.status !== 'active'
	);

	return {
		totalSessions: recentSessions.length,
		completedSessions: recentSessions.filter(s => s.completedSuccessfully).length,
		interruptedSessions: recentSessions.filter(s => s.status === 'interrupted').length,
		successRate: calculate30DaySuccessRate(sessions),
		totalMinutes: recentSessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0),
	};
}
