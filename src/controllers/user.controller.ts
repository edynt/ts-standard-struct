import { Request, Response } from 'express';
import { DatabaseHook } from '../hooks/useDatabase';
import { CacheHook } from '../hooks/useCache';
import { LoggerHook } from '../hooks/useLogger';
import { AuthHook } from '../hooks/useAuth';

export class UserController {
  private db = DatabaseHook.getInstance();
  private cache = CacheHook.getInstance();
  private logger = LoggerHook.getInstance();
  private auth = AuthHook.getInstance();

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this.db.getClient().user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Validate password here...

      const token = await this.auth.generateToken(user.id);
      await this.cache.set(`user:${user.id}`, user, 3600);

      this.logger.info('User logged in', { userId: user.id });

      return res.json({ token });
    } catch (error) {
      this.logger.error('Login error', { error });
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}