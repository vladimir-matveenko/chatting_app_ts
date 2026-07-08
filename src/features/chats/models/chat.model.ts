export interface Chat {

    id: number;

    type: string;

    title: string | null;

    avatar_url: string | null;

    owner_id: number | null;

    created_at: Date;

    updated_at: Date;

}