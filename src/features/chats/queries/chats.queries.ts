export const ChatsQueries = {
  CREATE_CHAT: `
        INSERT INTO chats (

            type,

            fingerprint,

            title,

            avatar_url,

            owner_id

        )

        VALUES (

            $1,

            $2,

            $3,

            $4,
            
            $5

        )

        RETURNING *;
    `,

  FIND_BY_FINGERPRINT: `
        SELECT *
        FROM chats
        WHERE fingerprint = $1;
    `,

  FIND_BY_ID: `
    SELECT *
    FROM chats
    WHERE id = $1;
    `,

  FIND_ALL_BY_USER: `
    SELECT

        c.id,
        c.type,
        c.title,
        c.avatar_url,
        c.owner_id,
        c.created_at,
        c.updated_at,

        NULL::text AS last_message,
        NULL::timestamptz AS last_message_at,
        0::integer AS unread_count

    FROM chats c

    INNER JOIN chat_members cm
        ON cm.chat_id = c.id

    WHERE
        cm.user_id = $1
        AND cm.is_archived = FALSE

    ORDER BY c.updated_at DESC;
`,

  UPDATE_ACTIVITY: `
    UPDATE chats

    SET updated_at = NOW()

    WHERE id = $1;
    `,
};
