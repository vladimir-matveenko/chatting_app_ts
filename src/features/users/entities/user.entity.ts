export interface UserEntity {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}