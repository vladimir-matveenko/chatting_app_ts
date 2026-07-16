export const UsersQueries = {
  CREATE: `
        INSERT INTO users (
            user_name,
            email,
            password_hash
        )
        VALUES ($1, $2, $3)
        RETURNING *
    `,

  FIND_BY_ID: `
        SELECT *
        FROM users
        WHERE id = $1
    `,

  FIND_BY_EMAIL: `
        SELECT *
        FROM users
        WHERE email = $1
    `,

  FIND_BY_USERNAME: `
        SELECT *
        FROM users
        WHERE user_name = $1
    `,

  UPDATE_USER: `
    UPDATE users
    SET
        email =
            COALESCE($2, email),
        user_name =
            COALESCE($3, user_name),
        display_name = 
            COALESCE($4, display_name),
        avatar_url = 
            COALESCE($5, avatar_url)
    WHERE id = $1
    RETURNING *;
    `,

  UPDATE_PASSWORD: `
    UPDATE users
    SET
        password_hash = $2
    WHERE id = $1
    RETURNING *;
    `,

  FIND_CREDENTIALS_BY_ID: `
    SELECT
        id,
        password_hash
    FROM users
    WHERE id = $1
    `,

  FIND_BY_IDS: `
    SELECT *
    FROM users
    WHERE id = ANY($1::bigint[])
    `,

  SEARCH: `
    SELECT
        u.id,
        u.user_name,
        u.display_name,
        u.avatar_url,
        (
            SELECT c.id
            FROM chats c
            INNER JOIN chat_members me
                ON me.chat_id = c.id
            INNER JOIN chat_members other
                ON other.chat_id = c.id
            WHERE
                c.type = 'private'
            AND
                me.user_id = $1
            AND
                other.user_id = u.id
            LIMIT 1
        ) AS private_chat_id

    FROM users u
    WHERE
    u.id <> $1

    AND
    (
        $2::text IS NULL
        OR
        u.user_name ILIKE '%' || $2 || '%'
        OR
        u.display_name ILIKE '%' || $2 || '%'
    )

    ORDER BY
        u.display_name NULLS LAST,
        u.user_name

    LIMIT $3

    OFFSET $4;
    `,
};
