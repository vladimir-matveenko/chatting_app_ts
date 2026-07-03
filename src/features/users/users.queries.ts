export const UsersQueries = {

    CREATE: `
        INSERT INTO users (
            username,
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
        WHERE username = $1
    `,

};