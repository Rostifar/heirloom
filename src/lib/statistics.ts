import { subDays, isAfter, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
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

export function calculateLastCalendarDayMinutes(sessions: Session[]): number {
	const today = new Date();
	const todayStart = startOfDay(today);
	const todayEnd = endOfDay(today);

	const todaySessions = sessions.filter(s => {
		const sessionStart = new Date(s.startTime);
		return isWithinInterval(sessionStart, { start: todayStart, end: todayEnd }) && s.status !== 'active';
	});

	return todaySessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
}

export function getDailyStats(sessions: Session[]): SessionStats {
	const today = new Date();
	const todayStart = startOfDay(today);
	const todayEnd = endOfDay(today);

	const todaySessions = sessions.filter(s => {
		const sessionStart = new Date(s.startTime);
		return isWithinInterval(sessionStart, { start: todayStart, end: todayEnd }) && s.status !== 'active';
	});

	const completedSessions = todaySessions.filter(s => s.completedSuccessfully).length;
	const totalSessions = todaySessions.length;
	const successRate = totalSessions === 0 ? 0 : Math.round((completedSessions / totalSessions) * 100);

	return {
		totalSessions,
		completedSessions,
		interruptedSessions: todaySessions.filter(s => s.status === 'interrupted').length,
		successRate,
		totalMinutes: todaySessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0),
		lastCalendarDayMinutes: todaySessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0),
	};
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
		lastCalendarDayMinutes: calculateLastCalendarDayMinutes(sessions),
	};
}
