import { Request, Response } from 'express';
import { ErrorResponse, UserResponse } from '../responses/UserResponse';

export const createUser = (req: Request, res: Response<UserResponse | ErrorResponse>) => {
  const { name, email } = req.body as { name?: string; email?: string };
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  res.status(201).json({ id: crypto.randomUUID(), name, email });
};
