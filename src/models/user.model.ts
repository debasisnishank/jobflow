export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
};
