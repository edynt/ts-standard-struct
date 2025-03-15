import { AppEventEmitter } from './eventEmitter';
import { User } from '@prisma/client';
import { QueueHook } from '../hooks/useQueue';

export class UserEvents {
  private static instance: UserEvents;
  private eventEmitter = AppEventEmitter.getInstance();
  private queue = QueueHook.getInstance();

  private constructor() {
    this.setupEventHandlers();
  }

  public static getInstance(): UserEvents {
    if (!UserEvents.instance) {
      UserEvents.instance = new UserEvents();
    }
    return UserEvents.instance;
  }

  private setupEventHandlers(): void {
    this.eventEmitter.on('user.created', this.handleUserCreated.bind(this));
    this.eventEmitter.on('user.updated', this.handleUserUpdated.bind(this));
  }

  private async handleUserCreated(user: User): Promise<void> {
    await this.queue.publish('user.created', user);
  }

  private async handleUserUpdated(user: User): Promise<void> {
    await this.queue.publish('user.updated', user);
  }

  public emitUserCreated(user: User): void {
    this.eventEmitter.emit('user.created', user);
  }

  public emitUserUpdated(user: User): void {
    this.eventEmitter.emit('user.updated', user);
  }
}