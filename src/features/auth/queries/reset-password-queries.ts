export const ResetPasswordQueries = {
  INVALIDATE_PASSWORD_RESET_CODES: `
    UPDATE password_reset_codes
    SET used_at = NOW()
    WHERE user_id = $1
      AND used_at IS NULL
  `,

  CREATE_PASSWORD_RESET_CODE: `
    INSERT INTO password_reset_codes (
      user_id,
      code_hash,
      expires_at
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      user_id,
      code_hash,
      reset_token_hash,
      expires_at,
      attempts,
      verified_at,
      used_at,
      created_at,
      reset_token_expires_at
  `,

  FIND_PASSWORD_RESET_CODE: `
    SELECT
      id,
      user_id,
      code_hash,
      reset_token_hash,
      expires_at,
      attempts,
      verified_at,
      used_at,
      created_at,
      reset_token_expires_at
    FROM password_reset_codes
    WHERE user_id = $1
      AND used_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `,

  INCREMENT_PASSWORD_RESET_ATTEMPTS: `
    UPDATE password_reset_codes
    SET attempts = attempts + 1
    WHERE id = $1
  `,

  VERIFY_PASSWORD_RESET_CODE: `
    UPDATE password_reset_codes
    SET
      verified_at = NOW(),
      reset_token_hash = $2,
      reset_token_expires_at = $3
    WHERE id = $1
      AND used_at IS NULL
      AND verified_at IS NULL
      AND expires_at > NOW()
    RETURNING
      id,
      user_id,
      reset_token_expires_at,
      verified_at,
      reset_token_hash
  `,

  FIND_PASSWORD_RESET_BY_TOKEN: `
    SELECT
      id,
      user_id,
      reset_token_hash,
      reset_token_expires_at,
      verified_at,
      used_at
    FROM password_reset_codes
    WHERE reset_token_hash = $1
      AND used_at IS NULL
      AND verified_at IS NOT NULL
      AND reset_token_expires_at > NOW()
    LIMIT 1
  `,

  COMPLETE_PASSWORD_RESET: `
    UPDATE password_reset_codes
    SET used_at = NOW()
    WHERE id = $1
      AND used_at IS NULL
    RETURNING id
  `,
};
