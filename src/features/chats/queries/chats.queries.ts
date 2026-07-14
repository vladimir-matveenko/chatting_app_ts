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

    (
        SELECT m.body
        FROM messages m
        WHERE
            m.chat_id = c.id
        AND
            m.is_deleted = FALSE
        ORDER BY
            m.created_at DESC
        LIMIT 1
    ) AS last_message,

    (
        SELECT m.created_at
        FROM messages m
        WHERE
            m.chat_id = c.id
        AND
            m.is_deleted = FALSE
        ORDER BY
            m.created_at DESC
        LIMIT 1
    ) AS last_message_at,

    (
        SELECT COUNT(*)
        FROM messages m
        LEFT JOIN chat_reads cr
            ON cr.chat_id = c.id
           AND cr.user_id = $1
        WHERE
            m.chat_id = c.id
        AND
            m.is_deleted = FALSE
        AND (
            cr.last_read_message_id IS NULL
            OR
            m.id > cr.last_read_message_id
        )
    )::integer AS unread_count,

    COALESCE(
        (
            SELECT jsonb_agg(participant)
            FROM (
                SELECT
                    jsonb_build_object(
                        'id', u.id,
                        'username', u.user_name,
                        'displayName', u.display_name,
                        'avatarUrl', u.avatar_url
                    ) AS participant
                FROM chat_members cm2

                INNER JOIN users u
                    ON u.id = cm2.user_id

                WHERE
                    cm2.chat_id = c.id
                AND
                    u.id <> $1

                ORDER BY
                    u.display_name NULLS LAST,
                    u.user_name

                LIMIT 2
            ) participants
        ),
        '[]'::jsonb
    ) AS participants,

    (
        SELECT COUNT(*)
        FROM chat_members cm2
        WHERE cm2.chat_id = c.id
    )::integer AS participants_count

FROM chats c

INNER JOIN chat_members cm
    ON cm.chat_id = c.id

WHERE
    cm.user_id = $1
AND
    cm.is_archived = FALSE

ORDER BY
    COALESCE(
        (
            SELECT m.created_at
            FROM messages m
            WHERE
                m.chat_id = c.id
            AND
                m.is_deleted = FALSE
            ORDER BY
                m.created_at DESC
            LIMIT 1
        ),
        c.updated_at
    ) DESC;
`,

  UPDATE_ACTIVITY: `
    UPDATE chats

    SET updated_at = NOW()

    WHERE id = $1;
    `,
};
