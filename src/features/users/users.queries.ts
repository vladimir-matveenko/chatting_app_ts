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

};