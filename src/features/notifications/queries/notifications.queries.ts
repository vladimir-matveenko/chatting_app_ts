export const NotificationsQueries = {
  CREATE: `
    INSERT INTO notifications (
        user_id,
        type,
        payload
    )
    VALUES (
        $1,
        $2,
        $3
    )
    RETURNING
        id,
        user_id,
        type,
        payload,
        is_read,
        created_at,
        read_at;
    `,

  FIND_ALL_BY_USER: `
    SELECT
        id,
        user_id,
        type,
        payload,
        is_read,
        created_at,
        read_at
    FROM notifications
    WHERE
        user_id = $1
    AND (
        $2::text IS NULL
        OR
        type = $2
    )
    ORDER BY
        created_at DESC,
        id DESC
    LIMIT $3
    OFFSET $4;
  `,

  FIND_BY_ID: `
    SELECT
        id,
        user_id,
        type,
        payload,
        is_read,
        created_at,
        read_at
    FROM notifications
    WHERE id = $1;
    `,

  COUNT_UNREAD: `
    SELECT COUNT(*)::INTEGER AS count
    FROM notifications
    WHERE user_id = $1
    AND is_read = FALSE;
    `,

  MARK_READ: `
    UPDATE notifications
    SET
        is_read = TRUE,
        read_at = NOW()
    WHERE
        id = $1
        AND user_id = $2
        AND is_read = FALSE
    RETURNING
        id,
        user_id,
        type,
        payload,
        is_read,
        created_at,
        read_at;
    `,

  MARK_ALL_READ: `
    UPDATE notifications
    SET
        is_read = TRUE,
        read_at = NOW()
    WHERE
        user_id = $1
        AND is_read = FALSE;
    `,

  DELETE_OLD: `
    DELETE FROM notifications
    WHERE created_at < NOW() - INTERVAL '1 year';
    `,

  DELETE: `
    DELETE FROM notifications
    WHERE id = $1;
    `,

  DELETE_ALL_BY_USER: `
    DELETE FROM notifications
    WHERE user_id = $1;
    `,
};
