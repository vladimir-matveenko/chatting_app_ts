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

      su.user_name      AS sender_user_name,
      su.display_name   AS sender_display_name,
      su.avatar_url     AS sender_avatar_url,

      m.type,
      m.body,
      m.reply_to_id,
      m.created_at,
      m.updated_at,
      m.deleted_at,
      m.is_deleted,

      m.reactions,

      (
      SELECT COUNT(*)
      FROM chat_reads cr
      WHERE
        cr.chat_id = m.chat_id
      AND
        cr.user_id <> m.sender_id
      AND
        cr.last_read_message_id >= m.id
      ) AS read_count,

      rm.id           AS reply_id,
      rm.sender_id    AS reply_sender_id,

      ru.user_name    AS reply_sender_user_name,
      ru.display_name AS reply_sender_display_name,
      ru.avatar_url   AS reply_sender_avatar_url,

      rm.type         AS reply_type,
      rm.body         AS reply_body,
      rm.deleted_at   AS reply_deleted_at

    FROM messages m

    INNER JOIN users su
      ON su.id = m.sender_id

    LEFT JOIN messages rm
      ON rm.id = m.reply_to_id

    LEFT JOIN users ru
      ON ru.id = rm.sender_id

    WHERE
      m.id = $1;
  `,

  FIND_LATEST: `
  SELECT
    m.id,
    m.chat_id,
    m.sender_id,

    su.user_name      AS sender_user_name,
    su.display_name   AS sender_display_name,
    su.avatar_url     AS sender_avatar_url,

    m.type,
    m.body,
    m.reply_to_id,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.is_deleted,
    m.is_pinned,

    m.reactions,

    (
      SELECT COUNT(*)
      FROM chat_reads cr
      WHERE
        cr.chat_id = m.chat_id
      AND
        cr.user_id <> m.sender_id
      AND
        cr.last_read_message_id >= m.id
    ) AS read_count,

    ur.type AS current_user_reaction,

    rm.id         AS reply_id,
    rm.sender_id  AS reply_sender_id,

    ru.user_name    AS reply_sender_user_name,
    ru.display_name AS reply_sender_display_name,
    ru.avatar_url   AS reply_sender_avatar_url,

    rm.type       AS reply_type,
    rm.body       AS reply_body,
    rm.deleted_at AS reply_deleted_at

  FROM messages m

  INNER JOIN users su
    ON su.id = m.sender_id

  LEFT JOIN messages rm
    ON rm.id = m.reply_to_id
   AND rm.is_deleted = FALSE

  LEFT JOIN users ru
    ON ru.id = rm.sender_id

  LEFT JOIN message_reactions ur
    ON ur.message_id = m.id
   AND ur.user_id = $2

  WHERE
    m.chat_id = $1
  AND
    m.is_deleted = FALSE

  ORDER BY
    m.id DESC

  LIMIT $3;
`,

  FIND_BEFORE: `
  SELECT
    m.id,
    m.chat_id,
    m.sender_id,

    su.user_name      AS sender_user_name,
    su.display_name   AS sender_display_name,
    su.avatar_url     AS sender_avatar_url,

    m.type,
    m.body,
    m.reply_to_id,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.is_deleted,
    m.is_pinned,

    m.reactions,

    (
      SELECT COUNT(*)
      FROM chat_reads cr
      WHERE
        cr.chat_id = m.chat_id
      AND
        cr.user_id <> m.sender_id
      AND
        cr.last_read_message_id >= m.id
    ) AS read_count,

    ur.type AS current_user_reaction,

    rm.id         AS reply_id,
    rm.sender_id  AS reply_sender_id,

    ru.user_name    AS reply_sender_user_name,
    ru.display_name AS reply_sender_display_name,
    ru.avatar_url   AS reply_sender_avatar_url,

    rm.type       AS reply_type,
    rm.body       AS reply_body,
    rm.deleted_at AS reply_deleted_at

  FROM messages m

  INNER JOIN users su
    ON su.id = m.sender_id

  LEFT JOIN messages rm
    ON rm.id = m.reply_to_id
   AND rm.is_deleted = FALSE

  LEFT JOIN users ru
    ON ru.id = rm.sender_id

  LEFT JOIN message_reactions ur
    ON ur.message_id = m.id
   AND ur.user_id = $2

  WHERE
    m.chat_id = $1
  AND
    m.is_deleted = FALSE
  AND
    m.id < $3

  ORDER BY
    m.id DESC

  LIMIT $4;
`,

  FIND_AFTER: `
  SELECT
    m.id,
    m.chat_id,
    m.sender_id,

    su.user_name      AS sender_user_name,
    su.display_name   AS sender_display_name,
    su.avatar_url     AS sender_avatar_url,

    m.type,
    m.body,
    m.reply_to_id,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.is_deleted,
    m.is_pinned,

    m.reactions,

    (
      SELECT COUNT(*)
      FROM chat_reads cr
      WHERE
        cr.chat_id = m.chat_id
      AND
        cr.user_id <> m.sender_id
      AND
        cr.last_read_message_id >= m.id
    ) AS read_count,

    ur.type AS current_user_reaction,

    rm.id         AS reply_id,
    rm.sender_id  AS reply_sender_id,

    ru.user_name    AS reply_sender_user_name,
    ru.display_name AS reply_sender_display_name,
    ru.avatar_url   AS reply_sender_avatar_url,

    rm.type       AS reply_type,
    rm.body       AS reply_body,
    rm.deleted_at AS reply_deleted_at

  FROM messages m

  INNER JOIN users su
    ON su.id = m.sender_id

  LEFT JOIN messages rm
    ON rm.id = m.reply_to_id
   AND rm.is_deleted = FALSE

  LEFT JOIN users ru
    ON ru.id = rm.sender_id

  LEFT JOIN message_reactions ur
    ON ur.message_id = m.id
   AND ur.user_id = $2

  WHERE
    m.chat_id = $1
  AND
    m.is_deleted = FALSE
  AND
    m.id > $3

  ORDER BY
    m.id ASC

  LIMIT $4;
`,

  UPDATE: `
    UPDATE messages
    SET
      body = $2,
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

  PIN_MESSAGE: `
    UPDATE messages
    SET
      is_pinned = TRUE,
      updated_at = NOW()
    WHERE
      id = $1
    RETURNING *;
  `,

  UNPIN_MESSAGE: `
    UPDATE messages
    SET
      is_pinned = FALSE,
      updated_at = NOW()
    WHERE
      id = $1
    RETURNING *;
  `,

  FIND_PINNED_BY_CHAT: `
  SELECT
    m.id,
    m.chat_id,
    m.sender_id,

    su.user_name      AS sender_user_name,
    su.display_name   AS sender_display_name,
    su.avatar_url     AS sender_avatar_url,

    m.type,
    m.body,
    m.reply_to_id,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.is_deleted,
    m.is_pinned,

    m.reactions,

    (
      SELECT COUNT(*)
      FROM chat_reads cr
      WHERE
        cr.chat_id = m.chat_id
      AND
        cr.user_id <> m.sender_id
      AND
        cr.last_read_message_id >= m.id
    ) AS read_count,

    ur.type AS current_user_reaction,

    rm.id         AS reply_id,
    rm.sender_id  AS reply_sender_id,

    ru.user_name    AS reply_sender_user_name,
    ru.display_name AS reply_sender_display_name,
    ru.avatar_url   AS reply_sender_avatar_url,

    rm.type       AS reply_type,
    rm.body       AS reply_body,
    rm.deleted_at AS reply_deleted_at

  FROM messages m

  INNER JOIN users su
    ON su.id = m.sender_id

  LEFT JOIN messages rm
    ON rm.id = m.reply_to_id
   AND rm.is_deleted = FALSE

  LEFT JOIN users ru
    ON ru.id = rm.sender_id

  LEFT JOIN message_reactions ur
    ON ur.message_id = m.id
   AND ur.user_id = $2

  WHERE
    m.chat_id = $1
  AND
    m.is_deleted = FALSE
  AND
    m.is_pinned = TRUE

  ORDER BY
    m.id DESC;
`,

  FIND_AROUND_MESSAGE: `
WITH
before_messages AS (
    SELECT *
    FROM messages
    WHERE
        chat_id = $1
    AND
        is_deleted = FALSE
    AND
        id < $2
    ORDER BY id DESC
    LIMIT $4
),

target_message AS (
    SELECT *
    FROM messages
    WHERE
        chat_id = $1
    AND
        is_deleted = FALSE
    AND
        id = $2
),

after_messages AS (
    SELECT *
    FROM messages
    WHERE
        chat_id = $1
    AND
        is_deleted = FALSE
    AND
        id > $2
    ORDER BY id ASC
    LIMIT $5
),

context_messages AS (
    SELECT * FROM before_messages
    UNION ALL
    SELECT * FROM target_message
    UNION ALL
    SELECT * FROM after_messages
)

SELECT
    m.id,
    m.chat_id,
    m.sender_id,

    su.user_name      AS sender_user_name,
    su.display_name   AS sender_display_name,
    su.avatar_url     AS sender_avatar_url,

    m.type,
    m.body,
    m.reply_to_id,
    m.created_at,
    m.updated_at,
    m.deleted_at,
    m.is_deleted,
    m.is_pinned,

    m.reactions,

    (
        SELECT COUNT(*)
        FROM chat_reads cr
        WHERE
            cr.chat_id = m.chat_id
        AND
            cr.user_id <> m.sender_id
        AND
            cr.last_read_message_id >= m.id
    ) AS read_count,

    ur.type AS current_user_reaction,

    rm.id         AS reply_id,
    rm.sender_id  AS reply_sender_id,

    ru.user_name    AS reply_sender_user_name,
    ru.display_name AS reply_sender_display_name,
    ru.avatar_url   AS reply_sender_avatar_url,

    rm.type       AS reply_type,
    rm.body       AS reply_body,
    rm.deleted_at AS reply_deleted_at

FROM context_messages m

INNER JOIN users su
    ON su.id = m.sender_id

LEFT JOIN messages rm
    ON rm.id = m.reply_to_id
   AND rm.is_deleted = FALSE

LEFT JOIN users ru
    ON ru.id = rm.sender_id

LEFT JOIN message_reactions ur
    ON ur.message_id = m.id
   AND ur.user_id = $3

ORDER BY m.id DESC;
`,

  HAS_MESSAGES_BEFORE: `
  SELECT 1
  FROM messages
  WHERE
    chat_id = $1
  AND
    is_deleted = FALSE
  AND
    id < $2
  LIMIT 1;
  `,

  HAS_MESSAGES_AFTER: `
  SELECT 1
  FROM messages
  WHERE
    chat_id = $1
  AND
    is_deleted = FALSE
  AND
    id > $2
  LIMIT 1;
  `,
};
