export interface Action {
  id: string;
  type: string;
  payload: Record<string, any>;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateActionDto {
  type: string;
  payload: Record<string, any>;
}