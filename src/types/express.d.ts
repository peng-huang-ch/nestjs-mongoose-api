// Make sure we're a module
export {};

// @types/passport + request
declare global {
  namespace Express {
    export interface User {
      id?: string;
      email?: string;
    }

    export interface Request {
      user?: User;
    }
  }
}
