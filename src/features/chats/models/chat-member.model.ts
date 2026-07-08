export interface ChatMember {

    chat_id: number;

    user_id: number;

    role: string;

    joined_at: Date;

    last_read_message_id: number | null;

    is_muted: boolean;

    is_archived: boolean;

}