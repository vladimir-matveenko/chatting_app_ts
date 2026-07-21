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

  ADD_MANY: `
        INSERT INTO chat_members (
            chat_id,
            user_id,
            role
        )
        VALUES (
            $1,
            $2,
            $3
        );
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

    JOIN users u
        ON u.id = cm.user_id

    WHERE
        cm.chat_id = $1

    ORDER BY joined_at;
    `,

  IS_MEMBER: `
    SELECT 1

    FROM chat_members

    WHERE

        chat_id = $1

        AND user_id = $2

        AND is_archived = FALSE

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

  UPDATE_MEMBER_ROLE: `
    UPDATE chat_members
    SET role = $3
    WHERE
        chat_id = $1
    AND
        user_id = $2;
    `,
};
