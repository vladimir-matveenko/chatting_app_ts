export const MessageReactionsQueries = {
  ADD: `
INSERT INTO message_reactions (
    message_id,
    user_id,
    type
)

VALUES (
    $1,
    $2,
    $3
)

RETURNING *;
`,

  FIND_BY_MESSAGE_AND_USER: `
SELECT *
FROM message_reactions
WHERE
    message_id = $1
AND
    user_id = $2;
`,

  UPDATE: `
UPDATE message_reactions
SET
    type = $2
WHERE
    id = $1
RETURNING *;
`,

  DELETE: `
DELETE
FROM message_reactions
WHERE
    id = $1;
`,

  UPDATE_MESSAGE_REACTIONS_CACHE: `
UPDATE messages
SET reactions = (
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'type', type,
                'count', count
            )
            ORDER BY type
        ),
        '[]'::jsonb
    )
    FROM (
        SELECT
            type,
            COUNT(*) AS count
        FROM message_reactions
        WHERE message_id = $1
        GROUP BY type
    ) r
)
WHERE id = $1;
`,
};
