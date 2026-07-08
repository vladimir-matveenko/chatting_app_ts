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

};