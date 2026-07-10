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
        SELECT *

        FROM messages

        WHERE id = $1;
    `,

  FIND_BY_CHAT: `
    SELECT *

    FROM messages

    WHERE

        chat_id = $1

        AND

        (

            $2::bigint IS NULL

            OR

            id < $2

        )

    ORDER BY id DESC

    LIMIT $3;
    `,
};
