export interface SessionPause {
  id: string;
  sessionId: string;
  pausedAt: string;
  resumedAt: string | null;
}