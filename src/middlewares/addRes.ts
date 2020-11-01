import { NextFunction, Request, Response } from 'express';

export const addRes = (req: Request, res: Response, next: NextFunction) => {
  // Add headers

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  // habilitamos en el cors que pueda enviar 'auth'
  res.setHeader('access-control-expose-headers', 'auth');

  // Pass to next layer of middleware
  next();
};
