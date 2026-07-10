export const RefreshTokensQueries = {
  CREATE_REFRESH_TOKEN: `
        INSERT INTO refresh_tokens (
            user_id,
            token_hash,
            expires_at
        )
        VALUES (
            $1,
            $2,
            $3
        )
        RETURNING *;
    `,

  FIND_REFRESH_TOKEN: `
        SELECT *
        FROM refresh_tokens
        WHERE user_id = $1;
    `,

  UPDATE_REFRESH_TOKEN: `
        UPDATE refresh_tokens
        SET
            token_hash = $2,
            expires_at = $3,
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *;
    `,

  DELETE_REFRESH_TOKEN: `
        DELETE
        FROM refresh_tokens
        WHERE user_id = $1;
    `,
};
