export interface Tasks {
  defaultGlob: string;
  runEvery: number;
  source: string;
  target: string;
  nextRun?: number;
  nextRunReadable?: string;
  isRunning?: boolean;
}
