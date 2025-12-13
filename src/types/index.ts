export interface Session {
	id: string;
	startTime: string;
	endTime?: string;
	plannedDuration: number;
	actualDuration?: number;
	description?: string;
	status: 'active' | 'completed' | 'interrupted';
	completedSuccessfully: boolean;
}

export interface SessionData {
	sessions: Session[];
}

export interface SessionStats {
	totalSessions: number;
	completedSessions: number;
	interruptedSessions: number;
	successRate: number;
	totalMinutes: number;
}
