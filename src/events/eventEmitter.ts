import { EventEmitter } from 'events';
import { LoggerHook } from '../hooks/useLogger';

export class AppEventEmitter extends EventEmitter {
  private static instance: AppEventEmitter;
  private logger = LoggerHook.getInstance();

  private constructor() {
    super();
    this.setupErrorHandling();
  }

  public static getInstance(): AppEventEmitter {
    if (!AppEventEmitter.instance) {
      AppEventEmitter.instance = new AppEventEmitter();
    }
    return AppEventEmitter.instance;
  }

  private setupErrorHandling(): void {
    this.on('error', (error) => {
      this.logger.error('Event error:', error);
    });
  }
}