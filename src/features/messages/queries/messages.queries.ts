export const MessagesQueries = {
  CREATE: `
        INSERT INTO messages (
            chat_id,
            sender_id,
            type,
            body,
            reply_to_id
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

  FIND_BY_ID: `
    SELECT
    m.id,
    m.chat_id,
    m.sender_id,
    m.type,
    m.body,
    m.reply_to_id,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.is_deleted,

    rm.id           AS reply_id,
    rm.sender_id    AS reply_sender_id,
    rm.type         AS reply_type,
    rm.body         AS reply_body,
    rm.deleted_at   AS reply_deleted_at

  FROM messages m

  LEFT JOIN messages rm
    ON rm.id = m.reply_to_id

  WHERE m.id = $1;
    `,

  FIND_BY_CHAT: `
SELECT
    m.id,
    m.chat_id,
    m.sender_id,
    m.type,
    m.body,
    m.reply_to_id,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.is_deleted,

    m.reactions,

    ur.type AS current_user_reaction,

    rm.id         AS reply_id,
    rm.sender_id  AS reply_sender_id,
    rm.type       AS reply_type,
    rm.body       AS reply_body,
    rm.deleted_at AS reply_deleted_at

FROM messages m

LEFT JOIN messages rm
    ON rm.id = m.reply_to_id

LEFT JOIN message_reactions ur
    ON ur.message_id = m.id
   AND ur.user_id = $2

WHERE
    m.chat_id = $1
AND (
    $3::timestamptz IS NULL
    OR m.created_at < $3
)

ORDER BY m.created_at DESC

LIMIT $4;
`,

  UPDATE: `
        UPDATE messages
    SET
        body = $2,
        updated_at = NOW(),
        updated_at = NOW()
    WHERE
        id = $1
    RETURNING *;
    `,

  DELETE: `
    UPDATE messages
    SET
        is_deleted = TRUE,
        deleted_at = NOW(),
        updated_at = NOW(),
        body = NULL
    WHERE
        id = $1
    RETURNING *;
    `,
};
