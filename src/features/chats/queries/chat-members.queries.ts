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
    SELECT *

    FROM chat_members

    WHERE chat_id = $1

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
};
