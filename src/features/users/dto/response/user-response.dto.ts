export type UserResponseDto = {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};