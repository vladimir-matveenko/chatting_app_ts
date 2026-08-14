export const ChatMembersQueries = {
  ADD: `
        INSERT INTO chat_members (
            chat_id,
            user_id,
            role

        )
        VALUES (
            $1,
            $2,
            $3

        )
        RETURNING *;
    `,

  FIND_BY_CHAT: `
    SELECT
        cm.chat_id,
        cm.user_id,
        cm.role,
        cm.joined_at,
        cm.is_muted,
        cm.is_archived,

        u.user_name,
        u.display_name,
        u.avatar_url

    FROM chat_members cm

    INNER JOIN users u
        ON u.id = cm.user_id

    WHERE
        cm.chat_id = $1

    AND (
        $2::text IS NULL

        OR

        u.user_name ILIKE '%' || $2 || '%'

        OR

        u.display_name ILIKE '%' || $2 || '%'
    )

    ORDER BY
        u.display_name NULLS LAST,
        u.user_name,
        cm.user_id

    LIMIT $3
    OFFSET $4;
    `,

  FIND_MEMBER_IDS_BY_CHAT: `
    SELECT user_id
    FROM chat_members
    WHERE chat_id = $1;
    `,

  IS_MEMBER: `
    SELECT 1

    FROM chat_members

    WHERE
        chat_id = $1
        AND user_id = $2

    LIMIT 1;
    `,

  MUTE_CHAT: `
    UPDATE chat_members
    SET
        is_muted = $3
    WHERE
        chat_id = $1
    AND
        user_id = $2;
    `,

  LEAVE_CHAT: `
    DELETE FROM chat_members
    WHERE
        chat_id = $1
    AND
        user_id = $2;
    `,

  ADD_MEMBERS: `
    INSERT INTO chat_members (
        chat_id,
        user_id,
        role
    )

    SELECT
        $1,
        UNNEST($2::bigint[]),
        'member'::chat_member_role

    ON CONFLICT (chat_id, user_id)
    DO NOTHING;
    `,

  REMOVE_MEMBER: `
    DELETE FROM chat_members

    WHERE
        chat_id = $1

    AND
        user_id = $2;
    `,

  FIND_BY_CHAT_AND_USER: `
    SELECT
        cm.chat_id,
        cm.user_id,
        cm.role,
        cm.joined_at,
        cm.is_muted,
        cm.is_archived,

        u.user_name,
        u.display_name,
        u.avatar_url

    FROM chat_members cm

    JOIN users u
        ON u.id = cm.user_id

    WHERE
        cm.chat_id = $1
    AND cm.user_id = $2;
    `,

  UPDATE_ROLE: `
    UPDATE chat_members
    SET role = $3
    WHERE
        chat_id = $1
    AND
        user_id = $2;
    `,
};
