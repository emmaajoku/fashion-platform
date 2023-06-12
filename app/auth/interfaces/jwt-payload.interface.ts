export type UserRole = 'administrator' | 'customer';

export interface JwtPayload {
  userId: number;
  role: UserRole;
  emailAddress?: string;
}

export interface JwtTokenPayload {
  accessToken: string;
}
