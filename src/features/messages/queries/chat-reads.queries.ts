export const ChatReadsQueries = {
  MARK_READ: `
    INSERT INTO chat_reads (

      chat_id,

      user_id,

      last_read_message_id

    )

    VALUES (

      $1,

      $2,

      $3

    )

    ON CONFLICT (

      chat_id,

      user_id

    )

    DO UPDATE SET

      last_read_message_id = EXCLUDED.last_read_message_id,

      read_at = NOW()
  `,
};
