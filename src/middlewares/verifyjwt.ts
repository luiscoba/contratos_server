import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = <string>req.headers['auth'];
  const token = authHeader && authHeader.split(' ')[1];
  // console.log('authHeader', authHeader);
  // console.log('tokenn2', token);
  if (!token)
    return res.status(401).json({ message: 'Not authorized, without token' });

  let jwtPayload;

  try {
    jwtPayload = <any>(
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'tokensecret')
    );
    res.locals.jwtPayload = jwtPayload; // para luego obtener el idProvider
    //console.log('aqui va jwtPayload', jwtPayload);
  } catch (e) {
    return res.status(401).json({ message: 'Not Authorized' });
  }

  const { idProvider } = jwtPayload;

  const newToken = jwt.sign(
    { idProvider },
    process.env.ACCESS_TOKEN_SECRET || 'tokensecret',
    {
      expiresIn: '1h',
    }
  );
  // con cada peticion se genera un nuevo token
  res.header('auth', newToken); // retornamos un nuevo token

  // Call next
  next();
};
