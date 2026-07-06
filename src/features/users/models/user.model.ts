export type User = {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};