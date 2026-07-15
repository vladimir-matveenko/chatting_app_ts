export type User = {
  id: string;
  userName: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};
