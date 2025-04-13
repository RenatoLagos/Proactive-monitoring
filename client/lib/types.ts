export type AlertType = 'System exception' | 'Scheduled start failure' | 'Runtime Exceeded' | 'Terminated' | null;

export interface Robot {
  id: number;
  name: string;
  status: boolean;
  alert: AlertType;
  priority: '1 - Critical' | '2 - High' | '3 - Moderate' | '4 - Low';
  createdAt: string;
}

export interface PerformanceData {
  time: string;
  [key: string]: number | string;
} 