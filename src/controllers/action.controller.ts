import { Request, Response, NextFunction } from 'express';
import { ActionService } from '../services/actionService';

export class ActionController {
  private actionService: ActionService;

  constructor() {
    this.actionService = new ActionService();
  }

  async createAction(req: Request, res: Response, next: NextFunction) {
    try {
      const action = await this.actionService.createAction(req.body);
      res.status(201).json(action);
    } catch (error) {
      next(error);
    }
  }

  async getAction(req: Request, res: Response, next: NextFunction) {
    try {
      const action = await this.actionService.getAction(req.params.id);
      res.status(200).json(action);
    } catch (error) {
      next(error);
    }
  }

  async listActions(req: Request, res: Response, next: NextFunction) {
    try {
      const actions = await this.actionService.listActions();
      res.status(200).json(actions);
    } catch (error) {
      next(error);
    }
  }
}