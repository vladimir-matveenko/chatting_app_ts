export type UserResponseDto = {
  id: string;
  userName: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
