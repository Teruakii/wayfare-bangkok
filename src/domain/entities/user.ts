export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: Date;
}
