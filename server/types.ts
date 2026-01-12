import type { RequestHandler } from "express";

export interface ErrorInfo {
  method: string;
  type: string;
  err: unknown;
}

export interface ServerError {
  log: string;
  status: number;
  message: { err: string };
}



export interface UserController {
  getAllUsers: RequestHandler;
  createUser: RequestHandler;
  verifyUser: RequestHandler;
  updateUser: RequestHandler;
}

export interface DataController {
  parseRawData: RequestHandler;
  validateAstroData: RequestHandler;
}

export interface CookieController {
  setSSIDCookie: RequestHandler;
}

export interface SessionController {
  isLoggedIn: RequestHandler;
  startSession: RequestHandler;
}
