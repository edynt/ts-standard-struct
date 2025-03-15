import { LoggerHook } from '../hooks/useLogger';

export abstract class BaseJob {
  protected logger = LoggerHook.getInstance();

  abstract execute(...args: any[]): Promise<void>;

  protected async handleError(error: Error): Promise<void> {
    this.logger.error('Job error:', error);
    throw error;
  }
}