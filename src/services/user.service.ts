import { DatabaseHook } from '../hooks/useDatabase';
import { CacheHook } from '../hooks/useCache';
import { QueueHook } from '../hooks/useQueue';
import { LoggerHook } from '../hooks/useLogger';
import { UserRepository } from '../repositories/userRepository';
import { EmailJob } from '../jobs/emailJob';
import { UserEvents } from '../events/userEvents';
import { CreateUserDto, UpdateUserDto } from '../interfaces/user.interface';
import { createUserSchema } from '../validations/userValidation';
import { LoggerHook } from '../hooks/useLogger';

export class UserService {
  private db = DatabaseHook.getInstance();
  private cache = CacheHook.getInstance();
  private queue = QueueHook.getInstance();
  private logger = LoggerHook.getInstance();
  private userRepository: UserRepository;
  private emailJob: EmailJob;
  private userEvents: UserEvents;

  constructor() {
    this.userRepository = new UserRepository();
    this.emailJob = new EmailJob();
    this.userEvents = UserEvents.getInstance();
  }

  async getUser(id: string) {
    try {
      // Try to get from cache first
      const cachedUser = await this.cache.get(`user:${id}`);
      if (cachedUser) {
        this.logger.info('User found in cache', { id });
        return cachedUser;
      }

      // Get from database
      const user = await this.db.getClient().user.findUnique({
        where: { id },
      });

      if (user) {
        // Cache the user
        await this.cache.set(`user:${id}`, user, 3600); // Cache for 1 hour
        // Publish user fetch event
        await this.queue.publish('user.fetched', { id, timestamp: new Date() });
      }

      return user;
    } catch (error) {
      this.logger.error('Error fetching user', { id, error });
      throw error;
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      // Validate input
      const validatedData = createUserSchema.parse(data);

      // Create user
      const user = await this.userRepository.create(validatedData);

      // Emit event
      this.userEvents.emitUserCreated(user);

      // Send welcome email
      await this.emailJob.execute(user.email, 'Welcome!', `Welcome to our platform, ${user.name}!`);

      return user;
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw error;
    }
  }
}
